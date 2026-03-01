package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.service.CloudinaryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/upload")
public class CloudinaryController {
    private final CloudinaryService cloudinaryService;

    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    public SuccessResponse<String> upload(@RequestParam("file")MultipartFile file) throws IOException{
        String url = cloudinaryService.uploadFile(file);
        return ResponseUtil.ok(
                "Upload file Success",
                url
        );
    }
}
