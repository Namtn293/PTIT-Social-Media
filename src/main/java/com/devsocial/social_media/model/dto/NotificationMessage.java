package com.devsocial.social_media.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private String targetUsername;
    private String senderName;
    private String content;
    private String type;
    private Long postId;
    private String createdAt;
}
