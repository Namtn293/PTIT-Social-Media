package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MAIN_NOTIFICATIONS",indexes = {
        @Index(name = "user_id_index",columnList = "USER_ID")
})
public class Notification extends EntityBase {
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "IS_READ")
    private boolean isRead;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
}
