package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "MAIN_USER_INFO")
public class UserInfo extends EntityBase {
    @Column(name = "USERNAME")
    private String userName;

    @Column(name = "FULL_NAME")
    private String fullName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "AVATAR")
    private String avatar;

    @Column(name = "CLASS_ID")
    private String classId;
}
