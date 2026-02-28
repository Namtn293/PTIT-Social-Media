package com.devsocial.social_media.core.auth.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "AUTH_TOKEN")
public class Token extends EntityBase {
    @Column(name = "TOKEN")
    private String token;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "EXPIRED")
    private boolean expired;
}
