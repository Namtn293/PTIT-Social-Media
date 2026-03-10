package com.devsocial.social_media.model.dto;

import lombok.Data;

@Data
public class CommentUpdateDTO {
    private long userId;
    private String content;
}
