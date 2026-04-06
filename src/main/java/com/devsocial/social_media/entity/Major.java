package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "MAIN_MAJOR")
@Data
public class Major extends EntityBase {
    @Column(name = "MAJOR_NAME")
    private String majorName;
}
