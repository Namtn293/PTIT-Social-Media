package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "MAIN_DOCUMENTS")
public class Messages extends EntityBase {
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
}
