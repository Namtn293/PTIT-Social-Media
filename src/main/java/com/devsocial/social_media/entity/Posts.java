package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "MAIN_POSTS")
public class Posts extends EntityBase {
    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "SUBJECT_ID")
    private Long subjectId;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
}
