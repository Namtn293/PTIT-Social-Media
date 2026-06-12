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
@Table(name = "MAIN_SUBJECT")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subject extends EntityBase {
    @Column(name = "SUBJECT_NAME")
    private String subjectName;
}
