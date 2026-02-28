package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import com.devsocial.social_media.service.UserInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-info")
public class UserInfoController {
    private final UserInfoService userInfoService;

    public UserInfoController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    @PostMapping("get/all")
    public SuccessResponse<List<UserInfoAdminVO>> getAllUserInfo(){
        return ResponseUtil.ok(
                "Get All UserInfo Success",
                userInfoService.getAllUserInfo()
        );
    }

    @PostMapping("get/{userName}")
    public SuccessResponse<UserInfoVO> getUserInfo(@PathVariable String userName) {
        return ResponseUtil.ok(
              "Get UserInfo Success",
                userInfoService.getUserInfo(userName)
        );
    };

    @PostMapping("update/{userName}")
    public SuccessResponse<UserInfoVO> updateUserInfo(@PathVariable String userName,@RequestBody UserInfoDTO userInfoDTO){
        return ResponseUtil.ok(
                "Update UserInfo Success",
                userInfoService.updateInfo(userName,userInfoDTO)
        );
    }

    @PostMapping("ban/{userName}")
    public SuccessResponse<String> banUser(@PathVariable String userName) {
        userInfoService.banUser(userName);
        return ResponseUtil.ok("Account Banned");
    }

    @PostMapping("active/{userName}")
    public SuccessResponse<String> activeUser(@PathVariable String userName) {
        userInfoService.activeUser(userName);
        return ResponseUtil.ok("Account Active");
    }
}
