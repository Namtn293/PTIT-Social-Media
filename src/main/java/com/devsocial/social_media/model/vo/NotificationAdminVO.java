package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationAdminVO {
    private Long id; // Notification ID
    private String title;
    private String content;
    private String userName; // Recipient username or "Tất cả mọi người"
    private LocalDateTime createAt;
}
