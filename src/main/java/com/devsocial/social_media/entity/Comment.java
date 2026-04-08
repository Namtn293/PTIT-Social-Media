package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "MAIN_COMMENTS")
public class Comment extends EntityBase {
    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "POST_ID")
    private Long postId;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
}
