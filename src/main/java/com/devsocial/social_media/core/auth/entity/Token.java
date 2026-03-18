package com.devsocial.social_media.core.auth.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "AUTH_TOKEN")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Token extends EntityBase {
    @Column(name = "TOKEN")
    private String token;

    @Column(name = "USER_ID")
    private Long  userId;

    @Column(name = "EXPIRED")
    private boolean expired;

    @Column(name = "REVOKED")
    private boolean revoked;
}
