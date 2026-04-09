package com.devsocial.social_media.model.dto;

import lombok.Data;

@Data
public class PostUpdateDTO {
    private String title;
    private String content;
    private String subject;
    private Long postId;
}
