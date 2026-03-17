package com.devsocial.social_media.model.vo;

import com.devsocial.social_media.enumration.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoAdminVO {
    private Long id;
    private String userName;
    private String fullName;
    private Long imageId;
    private String email;
    private StatusEnum status;
}
