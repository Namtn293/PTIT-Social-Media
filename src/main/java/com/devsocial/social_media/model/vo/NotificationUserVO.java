package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationUserVO {
    private Long id; // UserNotification ID
    private String title;
    private String content;
    private LocalDateTime createAt;
    private String createBy; // Name/Display details of creator admin

    @JsonProperty("isRead")
    private Boolean isRead;
}
