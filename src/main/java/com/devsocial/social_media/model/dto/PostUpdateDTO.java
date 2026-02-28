package com.devsocial.social_media.model.dto;

public class PostUpdateDTO {
    private String title;
    private String content;
    private String subject;
    private Long postId;

    public String getSubject() {
        return subject;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Long getPostId() {
        return postId;
    }
}
