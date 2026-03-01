package com.devsocial.social_media.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private String userName;
    private String fullName;
    private String email;
    private String avatar;
    private String classId;
}
