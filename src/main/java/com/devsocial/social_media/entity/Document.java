package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "MAIN_DOCUMENTS")
public class Document extends EntityBase {
    @Column(name = "TITLE")
    private String title;

    @Column(name = "FILE_ID")
    private Long fileId;

    @Column(name = "IMAGE_ID")
    private Long imageId;

    @Column(name = "SUBJECT_ID")
    private Long subjectId;

    @Column(name = "CREATE_BY")
    private String createBy;

    @Column(name = "CREATED_AT")
    private java.time.LocalDateTime createdAt;

    @Column(name = "SIZE")
    private String size;

    @jakarta.persistence.PrePersist
    public void prePersist() {
        this.createdAt = java.time.LocalDateTime.now();
    }
}
