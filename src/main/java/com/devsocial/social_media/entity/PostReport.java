package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "MAIN_POST_REPORT")
public class PostReport extends EntityBase {
    @Column(name = "POST_ID")
    private Long postId;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "REASON")
    private String reason;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
}
