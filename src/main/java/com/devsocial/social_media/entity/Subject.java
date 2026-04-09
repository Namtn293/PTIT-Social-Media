package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "MAIN_SUBJECT")
public class Subject extends EntityBase {
    @Column(name = "SUBJECT_NAME")
    private String subjectName;

    public String getSubjectName() {
        return subjectName;
    }
}
