package com.devsocial.social_media.core.auth.model.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String fullName;
    private String email;
    private String userName;
    private String password;
}
