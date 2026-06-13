package com.devsocial.social_media.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Document;
import com.devsocial.social_media.entity.Files;
import com.devsocial.social_media.entity.Image;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.model.dto.DocumentDTO;
import com.devsocial.social_media.model.vo.DocumentVO;
import com.devsocial.social_media.repository.DocumentsRepository;
import com.devsocial.social_media.repository.FilesRepository;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.service.DocumentsService;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.repository.UserInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DocumentsServiceImplement implements DocumentsService {
    private final Cloudinary cloudinary;
    private final DocumentsRepository documentsRepository;
    private final ImageRepository imageRepository;
    private final FilesRepository filesRepository;
    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;

    public DocumentsServiceImplement(Cloudinary cloudinary, DocumentsRepository documentsRepository, ImageRepository imageRepository, FilesRepository filesRepository, UserRepository userRepository, UserInfoRepository userInfoRepository) {
        this.cloudinary = cloudinary;
        this.documentsRepository = documentsRepository;
        this.imageRepository = imageRepository;
        this.filesRepository = filesRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }

    private String formatFileSize(long bytes) {
        if (bytes <= 0) return "0 B";
        final String[] units = new String[] { "B", "KB", "MB", "GB", "TB" };
        int digitGroups = (int) (Math.log10(bytes)/Math.log10(1024));
        return new java.text.DecimalFormat("#,##0.#").format(bytes/Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }
    @Transactional
    @Override
    public void createDocument(DocumentDTO documentDTO, MultipartFile file, MultipartFile background) throws IOException {
        Long fileId = null;
        Long backgroundId = null;
        String sizeStr = "0 B";
        //upload file
        if(file!=null){
            sizeStr = formatFileSize(file.getSize());
            String type = file.getContentType();
            System.out.println(file.getContentType()+" "+type.equals("application/pdf"));

            if(!type.equals("application/pdf") &&
                    !type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                    !type.equals("application/msword")){
                throw new RuntimeException("Chỉ cho phép PDF, DOC, DOCX");
            }

            String originalName = file.getOriginalFilename();
            if (originalName != null) {
                originalName = originalName.replaceAll("[^a-zA-Z0-9.-]", "_");
            }

            String resourceType = "raw";
            String publicId = originalName;
            if (type != null && type.equalsIgnoreCase("application/pdf")) {
                resourceType = "image";
                if (publicId != null && publicId.toLowerCase().endsWith(".pdf")) {
                    publicId = publicId.substring(0, publicId.length() - 4);
                }
            }

            Map fileUploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", resourceType,
                            "folder", "documents",
                            "public_id", publicId,
                            "use_fileName", false
                    )
            );
            Files fileSave = Files.builder()
                    .url(fileUploadResult.get("secure_url").toString())
                    .public_id(fileUploadResult.get("public_id").toString())
                    .build();
            filesRepository.save(fileSave);
            fileId = fileSave.getId();
        }
        //upload background
        if(background!=null){
            Map imageUploadResult = cloudinary.uploader().upload(
                    background.getBytes(),
                    ObjectUtils.emptyMap()
            );
            Image image = Image.builder()
                    .url(imageUploadResult.get("url").toString())
                    .publicId(imageUploadResult.get("public_id").toString())
                    .build();
            imageRepository.save(image);
            backgroundId = image.getId();
        }
        Document document = Document.builder()
                .title(documentDTO.getTitle())
                .createBy(ThreadContext.getUserDetail().getUsername())
                .imageId(backgroundId)
                .fileId(fileId)
                .size(sizeStr)
                .build();
        documentsRepository.save(document);
        System.out.println(fileId+" "+backgroundId);
    }
    @Transactional
    @Override
    public void deleteDocument(Long documentId) {
        Document document = documentsRepository.findById(documentId)
                .orElseThrow(()->new BusinessException(ErrorCode.DOCUMENT_NOT_FOUND));
        User user = userRepository.findByUserName(ThreadContext.getUserDetail().getUsername())
                .orElseThrow(()->new BusinessException(ErrorCode.FORBIDDEN));
        if(user.getRole() == RoleEnum.ADMIN ||
                (user.getRole() == RoleEnum.STUDENT && user.getUsername().equals(document.getCreateBy()))
        ){
            if (document.getFileId() != null) {
                try {
                    Files file = filesRepository.findById(document.getFileId()).
                            orElseThrow(()->new BusinessException(ErrorCode.FILE_NOT_EXIST));
                    String resourceType = "raw";
                    if (file.getUrl() != null && file.getUrl().contains("/image/upload/")) {
                        resourceType = "image";
                    }
                    cloudinary.uploader().destroy(
                            file.getPublic_id(),
                            ObjectUtils.asMap(
                                    "resource_type", resourceType
                            )
                    );
                    filesRepository.delete(file);
                } catch (IOException e) {
                    throw new RuntimeException("Can't delete file");
                }
            }

            if (document.getImageId() != null) {
                try {
                    Image image = imageRepository.findById(document.getImageId()).
                            orElseThrow(()->new BusinessException(ErrorCode.IMAGE_NOT_EXIST));
                    cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
                    imageRepository.delete(image);
                } catch (IOException e) {
                    throw new RuntimeException("Can't delete background");
                }
            }
        }
        documentsRepository.delete(document);
        System.out.println("Delete document complete");
    }

    @Override
    public List<DocumentVO> getAllDocument() {
        List<Document> documents = documentsRepository.findAll();
        List<DocumentVO> documentVOS = new ArrayList<>();
        documents.forEach((d)->{
          documentVOS.add(convertToDocumentVO(d));
        });
        return documentVOS;
    }

    @Override
    public List<DocumentVO> getMyDocumentList() {
        String username = ThreadContext.getUserDetail().getUsername();
        List<Document> documents = documentsRepository.findByCreateBy(username);
        List<DocumentVO> documentVOS = new ArrayList<>();
        documents.forEach((d)->{
            documentVOS.add(convertToDocumentVO(d));
        });
        return documentVOS;
    }

    @Override
    public DocumentVO convertToDocumentVO(Document document) {
        DocumentVO documentVO = new DocumentVO();
        documentVO.setId(document.getId());
        
        String fileURL = null;
        if (document.getFileId() != null) {
            List<String> urls = documentsRepository.getFileURL(document.getFileId());
            if (urls != null && !urls.isEmpty()) {
                fileURL = urls.get(0);
            }
        }
        documentVO.setFileURL(fileURL);

        String imageURL = null;
        if (document.getImageId() != null) {
            List<String> urls = documentsRepository.getImageURL(document.getImageId());
            if (urls != null && !urls.isEmpty()) {
                imageURL = urls.get(0);
            }
        }
        documentVO.setImageURL(imageURL);

        documentVO.setTitle(document.getTitle());

        // Find uploader display name
        String uploaderName = "Thành viên PTIT";
        Optional<UserInfo> uploaderInfo = userInfoRepository.findByUserName(document.getCreateBy());
        if (uploaderInfo.isPresent()) {
            uploaderName = uploaderInfo.get().getFullName();
        }
        documentVO.setUploaderName(uploaderName);
        documentVO.setSize(document.getSize() != null ? document.getSize() : "N/A");
        
        // Format creation date
        String formattedDate = "";
        if (document.getCreatedAt() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");
            formattedDate = document.getCreatedAt().format(formatter);
        }
        documentVO.setCreatedAt(formattedDate);
        documentVO.setCreateBy(document.getCreateBy());

        if (document.getFileId() != null) {
            for (String i : documentsRepository.getFileURL(document.getFileId())) System.out.println(i);
        }
        if (document.getImageId() != null) {
            for (String i : documentsRepository.getImageURL(document.getImageId())) System.out.println(i);
        }
        return documentVO;
    }
}
