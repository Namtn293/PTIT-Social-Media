package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "MAIN_MESSAGES")
public class Message extends EntityBase {
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATED_AT")
    private String createdAt;

    @Column(name = "IS_EDITED")
    @Builder.Default
    private Boolean isEdited = false;

    @PrePersist
    public void prePersist(){
        DateTimeFormatter dateTimeFormatter=DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy");
        this.createdAt= LocalDateTime.now().format(dateTimeFormatter);
    }
}
