package com.devsocial.social_media.service;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserInfoService {
    List<UserInfoAdminVO> getAllUserInfo();
    UserInfoVO getUserInfo(String userName);
    UserInfoVO updateInfo(String userName, UserInfoDTO userInfoDTO, MultipartFile file) throws IOException;
    void banUser(String UserName);
    void activeUser(String UserName);

    UserInfoVO convertToUserInfoVO(UserInfo userInfo);
    UserInfoAdminVO convertToUserInfoAdminVO(UserInfo userInfo);
}
