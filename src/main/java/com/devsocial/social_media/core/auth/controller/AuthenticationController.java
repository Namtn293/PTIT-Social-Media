package com.devsocial.social_media.core.auth.controller;

import com.devsocial.social_media.core.auth.model.dto.RegisterDTO;
import com.devsocial.social_media.core.auth.service.AuthenticationService;
import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public SuccessResponse<String> register(@RequestBody RegisterDTO dto){
        authenticationService.register(dto);
        return ResponseUtil.ok("Register success");
    }
}
