package com.devsocial.social_media.core.auth.controller;

import com.devsocial.social_media.core.auth.model.dto.LoginDTO;
import com.devsocial.social_media.core.auth.model.dto.RegisterDTO;
import com.devsocial.social_media.core.auth.service.AuthenticationService;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.enumration.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public SuccessResponse<String> login(@RequestBody LoginDTO dto){
        return ResponseUtil.ok(authenticationService.login(dto));
    }


    @PostMapping("/logout")
    public SuccessResponse<String> logout(HttpServletRequest request){
        String authHeader=request.getHeader("Authorization");
        if (authHeader==null || !authHeader.contains("Bearer")) {
            throw new BusinessException(ErrorCode.TOKEN_NOT_CORRECT);
        }
        authHeader=authHeader.substring(7);
        authenticationService.logout(authHeader);
        return ResponseUtil.ok("Logout success");
    }

    @GetMapping("/statistic/get-user-total")
    public SuccessResponse<Long> getUserTotal(){
        return ResponseUtil.ok("Get user total success", authenticationService.getUserTotal());
    }

    @PostMapping("/set-admin/{userName}")
    public SuccessResponse<String> setAdminRole(@PathVariable String userName){
        authenticationService.setAdminRole(userName);
        return ResponseUtil.ok("User " + userName + " is now ADMIN");
    }
}
