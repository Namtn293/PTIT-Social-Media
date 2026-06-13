package com.devsocial.social_media.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationCreateDTO {
    private String title;
    private String content;
    private String userName; // username of recipient or "-1" for all
}
