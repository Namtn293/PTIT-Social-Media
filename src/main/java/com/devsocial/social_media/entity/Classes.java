package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "MAIN_CLASSES")
public class Classes extends EntityBase {
    @Column(name = "CLASS_NAME")
    private String className;

    @Column(name = "MAJOR_ID")
    private Long majorId;
}
