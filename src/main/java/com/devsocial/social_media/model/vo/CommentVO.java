package com.devsocial.social_media.model.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentVO {
    private String avatar;
    private String fullName;
    private LocalDateTime timeUnit;
    private String content;
}
