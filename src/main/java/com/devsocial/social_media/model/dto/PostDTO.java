package com.devsocial.social_media.model.dto;

import lombok.Data;
@Data
public class PostDTO {
    private String title;
    private String content;
    private String subject;

    public String getSubject() {
        return subject;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
