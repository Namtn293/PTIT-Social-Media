package com.devsocial.social_media.model.vo;

import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.enumration.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoManagementVO {
    private Long userId;
    private String userName;
    private String email;
    private StatusEnum status;
    private RoleEnum role;
    private String fullName;
    private String avatar;
    private String className;
}
