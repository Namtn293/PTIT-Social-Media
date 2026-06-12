package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoManagementVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import com.devsocial.social_media.service.UserInfoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user-info")
@CrossOrigin(origins = "http://localhost:5173")
public class UserInfoController {
    private final UserInfoService userInfoService;

    public UserInfoController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    @GetMapping("get/all")
    public SuccessResponse<List<UserInfoManagementVO>> getAllUserInfo(){
        return ResponseUtil.ok(
                "Get All UserInfo Success",
                userInfoService.getAllUserInfo()
        );
    }

    @PostMapping("get/{userName}")
    public SuccessResponse<UserInfoAdminVO> getUserInfo(@PathVariable String userName) {
        return ResponseUtil.ok(
              "Get UserInfo Success",
                userInfoService.getUserInfo(userName)
        );
    };

    @PostMapping(
            value = "update/{userName}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public SuccessResponse<String> updateUserInfo(
            @PathVariable String userName,
            @RequestPart("data") UserInfoDTO userInfoDTO,
            @RequestPart(value = "file",required = false) MultipartFile file
    ) throws IOException {
        if (file != null) {
            System.out.println("Uploading file: " + file.getOriginalFilename());
        }
        userInfoService.updateInfo(userName,userInfoDTO,file);
        return ResponseUtil.ok(
                "Update UserInfo Success",
                null
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
    @PostMapping("delete/{id}")
    public SuccessResponse<String> deleteUser(@PathVariable Long id) {
        userInfoService.delete(id);
        return ResponseUtil.ok("Delete account");
    }
}
