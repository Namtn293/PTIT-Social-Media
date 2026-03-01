package com.devsocial.social_media.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    String uploadFile(MultipartFile file) throws IOException;
    String getFile(String file) throws IOException;
}
