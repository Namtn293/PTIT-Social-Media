package com.devsocial.social_media.model.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DocumentDTO {
    private String title;
    private Long subjectId;
}
