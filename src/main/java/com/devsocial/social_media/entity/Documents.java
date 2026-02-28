package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "MAIN_DOCUMENTS")
public class Documents extends EntityBase {
    @Column(name = "TITLE")
    private String title;

    @Column(name = "FILE_URL")
    private String fileUrl;

    @Column(name = "BACKGROUND")
    private String background;

    @Column(name = "SUBJECT_ID")
    private Long subjectId;
}
