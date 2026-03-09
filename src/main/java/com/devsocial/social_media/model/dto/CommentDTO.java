package com.devsocial.social_media.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class CommentDTO {
    private Long postId;
    private Long userId;
    private String content;
}
