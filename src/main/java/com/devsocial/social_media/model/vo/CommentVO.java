package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentVO {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private Long userId;
    private Long postId;
    private String fullName;
    private String avatar;
}
