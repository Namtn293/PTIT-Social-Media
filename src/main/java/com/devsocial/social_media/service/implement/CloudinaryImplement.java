package com.devsocial.social_media.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.CloudinaryService;
import com.devsocial.social_media.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImplement implements CloudinaryService {
    private final Cloudinary cloudinary;
    private final UserInfoRepository userInfoRepository;
    private final ImageService imageService;

    public CloudinaryImplement(Cloudinary cloudinary, UserInfoRepository userInfoRepository, ImageService imageService) {
        this.cloudinary = cloudinary;
        this.userInfoRepository = userInfoRepository;
        this.imageService = imageService;
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );
        imageService.createImage(
                uploadResult.get("url").toString(),
                uploadResult.get("public_id").toString()
        );

        return uploadResult.get("url").toString();
    }

    @Override
    public String getFile(String userName) throws IOException {
        return userInfoRepository.findByUserName(userName).
                orElseThrow(()->new RuntimeException("user not found"))
                .getAvatar();
    }
}
