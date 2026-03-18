package com.devsocial.social_media.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.CloudinaryService;
import com.devsocial.social_media.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImplement implements CloudinaryService {
    private final Cloudinary cloudinary;
    private final UserInfoRepository userInfoRepository;
    private final ImageService imageService;

    public CloudinaryServiceImplement(Cloudinary cloudinary, UserInfoRepository userInfoRepository, ImageService imageService) {
        this.cloudinary = cloudinary;
        this.userInfoRepository = userInfoRepository;
        this.imageService = imageService;
    }
    @Transactional
    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String type = file.getContentType();
        System.out.println(file.getContentType()+" "+type.equals("application/pdf"));
        if(!type.equals("application/pdf") &&
                !type.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                !type.equals("application/msword")){
            throw new RuntimeException("Chỉ cho phép PDF, DOC, DOCX");
        }

        String originalName = file.getOriginalFilename();

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder","documents",
                        "public_id", originalName,
                        "use_filename", true,
                        "unique_filename", false
                )
        );

        return uploadResult.get("url").toString();
    }
}
