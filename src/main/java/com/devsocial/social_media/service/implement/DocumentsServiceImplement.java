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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    public DocumentsServiceImplement(Cloudinary cloudinary, DocumentsRepository documentsRepository, ImageRepository imageRepository, FilesRepository filesRepository, UserRepository userRepository) {
        this.cloudinary = cloudinary;
        this.documentsRepository = documentsRepository;
        this.imageRepository = imageRepository;
        this.filesRepository = filesRepository;
        this.userRepository = userRepository;
    }
    @Transactional
    @Override
    public void createDocument(DocumentDTO documentDTO, MultipartFile file, MultipartFile background) throws IOException {
        Long fileId = null;
        Long backgroundId = null;
        //upload file
        if(file!=null){
            String type = file.getContentType();
            System.out.println(file.getContentType()+" "+type.equals("application/pdf"));

            if(!type.equals("application/pdf") &&
                    !type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                    !type.equals("application/msword")){
                throw new RuntimeException("Chỉ cho phép PDF, DOC, DOCX");
            }

            String originalName = file.getOriginalFilename();

            Map fileUploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type","raw",
                            "folder","documents",
                            "public_id", originalName,
                            "use_fileName", false
                    )
            );
            Files fileSave = Files.builder()
                    .url(fileUploadResult.get("url").toString())
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
                .subjectId(documentDTO.getSubjectId())
                .createBy(ThreadContext.getUserDetail().getUsername())
                .imageId(backgroundId)
                .fileId(fileId)
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
            try {
                Files file = filesRepository.findById(document.getFileId()).
                        orElseThrow(()->new BusinessException(ErrorCode.FILE_NOT_EXIST));
                Map result = cloudinary.uploader().destroy(
                        file.getPublic_id(),
                        ObjectUtils.asMap(
                                "resource_type", "raw"
                        )
                );
                filesRepository.delete(file);
            } catch (IOException e) {
                throw new RuntimeException("Can't delete file");
            }

            try {
                Image image = imageRepository.findById(document.getImageId()).
                        orElseThrow(()->new BusinessException(ErrorCode.IMAGE_NOT_EXIST));
                cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
                imageRepository.delete(image);
            } catch (IOException e) {
                throw new RuntimeException("Can't delete background");
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
    public DocumentVO convertToDocumentVO(Document document) {
        DocumentVO documentVO = new DocumentVO();
        documentVO.setFileURL(documentsRepository.getFileURL(document.getFileId()).get(0));
        documentVO.setImageURL(documentsRepository.getImageURL(document.getImageId()).get(0));
        documentVO.setTitle(document.getTitle());
        documentVO.setSubjectId(document.getSubjectId());
        for (String i : documentsRepository.getFileURL(document.getFileId())) System.out.println(i);
        for (String i : documentsRepository.getImageURL(document.getImageId())) System.out.println(i);
        return documentVO;

    }
}
