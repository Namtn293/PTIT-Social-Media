package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity(name = "MAIN_FILES")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Files extends EntityBase {
    @Column(name = "URL")
    private String url;
    @Column(name = "PUBLIC_ID")
    private String public_id;
}
