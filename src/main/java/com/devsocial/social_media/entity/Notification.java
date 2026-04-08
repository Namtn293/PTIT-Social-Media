package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "MAIN_NOTIFICATIONS")
public class Notification extends EntityBase {
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "IS_READ")
    private boolean isRead;
}
