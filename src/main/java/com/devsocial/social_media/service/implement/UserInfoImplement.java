package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.UserInfoService;
import lombok.Builder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class UserInfoImplement implements UserInfoService {
    private final UserInfoRepository userInfoRepository;

    public UserInfoImplement(UserInfoRepository userInfoRepository) {
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public List<UserInfoAdminVO> getAllUserInfo() {
        List<UserInfoAdminVO> uiaVOS = new ArrayList<>();
        userInfoRepository.findAll().forEach((ui)->uiaVOS.add(convertToUserInfoAdminVO(ui)));
        return uiaVOS;
    }

    @Override
    public UserInfoVO getUserInfo(String userName) {
        return convertToUserInfoVO(userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"))) ;
    }

    @Override
    public UserInfoVO updateInfo(String userName, UserInfoDTO userInfoDTO) {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        if(userInfoDTO.getFullName()!=null)
            userInfo.setFullName(userInfoDTO.getFullName());
        if(userInfoDTO.getEmail()!=null)
            userInfo.setEmail(userInfoDTO.getEmail());
        if(userInfoDTO.getAvatar()!=null)
            userInfo.setAvatar(userInfoDTO.getAvatar());
        userInfoRepository.save(userInfo);
        return convertToUserInfoVO(userInfo);
    }

    @Override
    public void banUser(String userName) {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        userInfo.setStatus("Banned");
        userInfoRepository.save(userInfo);
    }

    @Override
    public void activeUser(String userName) {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        userInfo.setStatus("Active");
        userInfoRepository.save(userInfo);
    }

    @Override
    public UserInfoVO convertToUserInfoVO(UserInfo userInfo) {
        return UserInfoVO.builder()
                .fullName(userInfo.getFullName())
                .email(userInfo.getEmail())
                .avatar(userInfo.getAvatar())
                .build();
    }

    @Override
    public UserInfoAdminVO convertToUserInfoAdminVO(UserInfo userInfo) {
        return UserInfoAdminVO.builder()
                .id(userInfo.getId())
                .userName(userInfo.getUserName())
                .fullName(userInfo.getFullName())
                .email(userInfo.getEmail())
                .status(userInfo.getStatus())
                .build();
    }

}
