package com.devsocial.social_media.service;

import com.devsocial.social_media.entity.Image;
import com.devsocial.social_media.entity.UserInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {
    Image createImage(String url, String publicId);
    void updateImage(UserInfo userInfo, MultipartFile file) throws IOException;
    void deleteImage(String url);
}