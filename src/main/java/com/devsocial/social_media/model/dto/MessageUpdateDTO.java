package com.devsocial.social_media.model.dto;

import lombok.Data;

@Data
public class MessageUpdateDTO {
    private Long userId;
    private String content;
}
