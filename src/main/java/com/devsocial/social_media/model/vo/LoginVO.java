package com.devsocial.social_media.model.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginVO {
    private String token;
    private Long userInfoId;
    private String avatar;
    private String fullName;
}
