package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import com.devsocial.social_media.enumration.StatusEnum;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "MAIN_USER_INFO")
public class UserInfo extends EntityBase {
    @Column(name = "USERNAME")
    private String userName;

    @Column(name = "FULL_NAME")
    private String fullName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "IMAGE_ID")
    private Long imageId;

    @Column(name = "CLASS_ID")
    private Long classId;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private StatusEnum status;

}
