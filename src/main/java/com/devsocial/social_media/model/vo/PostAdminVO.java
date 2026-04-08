package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostAdminVO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String author;
}
