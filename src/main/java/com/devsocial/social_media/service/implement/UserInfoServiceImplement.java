package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.enumration.StatusEnum;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoManagementVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.UserInfoService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@Service
public class UserInfoServiceImplement implements UserInfoService {
    private final UserInfoRepository userInfoRepository;
    private final CloudinaryServiceImplement cloudinaryServiceImplement;
    private final ImagesServiceImplement imageImplement;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final PasswordEncoder passwordEncoder;
    public UserInfoServiceImplement(UserRepository userRepository,UserInfoRepository userInfoRepository, CloudinaryServiceImplement cloudinaryServiceImplement, ImagesServiceImplement imageImplement, ImageRepository imageRepository, PasswordEncoder passwordEncoder) {
        this.userInfoRepository = userInfoRepository;
        this.cloudinaryServiceImplement = cloudinaryServiceImplement;
        this.imageImplement = imageImplement;
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserInfoManagementVO> getAllUserInfo() {
        List<UserInfoManagementVO> uiaVOS = new ArrayList<>();
        List<UserInfo> list=userInfoRepository.findAll();
        list.forEach(c->{
            if(userRepository.findByUserName(c.getUserName())
                    .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND)).getRole()== RoleEnum.STUDENT){
                String avatar = null;
                if (c.getImageId() != null) {
                    avatar = imageRepository.findAvatarById(c.getImageId());
                }
                if (avatar == null) {
                    avatar = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg";
                }
                String className = null;
                UserInfoManagementVO vo=UserInfoManagementVO.builder()
                        .role(userRepository.findRoleEnumByUserName(c.getUserName()))
                        .status(c.getStatus())
                        .userName(c.getUserName())
                        .userId(c.getId())
                        .email(c.getEmail())
                        .fullName(c.getFullName())
                        .avatar(avatar)
                        .build();
                uiaVOS.add(vo);
            }
        });
        return uiaVOS;
    }

    @Override
    public UserInfoAdminVO getUserInfo(String userName) {
        return convertToUserInfoAdminVO(userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST))) ;
    }
    @Transactional
    @Override
    public void updateInfo(String userName, UserInfoDTO userInfoDTO, MultipartFile file) throws IOException {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        if(userInfoDTO.getFullName()!=null)
            userInfo.setFullName(userInfoDTO.getFullName());
        if(userInfoDTO.getEmail()!=null)
            userInfo.setEmail(userInfoDTO.getEmail());
        if(file!=null && !file.isEmpty()){
            imageImplement.updateImage(userInfo,file);
        }
        if(userInfoDTO.getPassword()!=null && !userInfoDTO.getPassword().isEmpty()){
            User user = userRepository.findByUserName(userName)
                    .orElseThrow(()->new RuntimeException("user not found"));
            user.setPassword(passwordEncoder.encode(userInfoDTO.getPassword()));
            userRepository.save(user);
        }

        userInfoRepository.save(userInfo);
    }

    @Override
    public void banUser(String userName) {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        userInfo.setStatus(StatusEnum.BANNED);
        userInfoRepository.save(userInfo);
    }

    @Override
    public void activeUser(String userName) {
        UserInfo userInfo = userInfoRepository.findByUserName(userName)
                .orElseThrow(()->new RuntimeException("user not found"));
        userInfo.setStatus(StatusEnum.ACTIVE);
        userInfoRepository.save(userInfo);
    }

    @Override
    public UserInfoVO convertToUserInfoVO(UserInfo userInfo) {
        return UserInfoVO.builder()
                .fullName(userInfo.getFullName())
                .email(userInfo.getEmail())
                .imageId(userInfo.getImageId())
                .build();
    }

    @Override
    public UserInfoAdminVO convertToUserInfoAdminVO(UserInfo userInfo) {
       String avatar = null;
        if (userInfo.getImageId() != null) {
            avatar = imageRepository.findAvatarById(userInfo.getImageId());
        }
        return UserInfoAdminVO.builder()
                .id(userInfo.getId())
                .userName(userInfo.getUserName())
                .fullName(userInfo.getFullName())
                .imageId(userInfo.getImageId())
                .avatar(avatar)
                .email(userInfo.getEmail())
                .status(userInfo.getStatus())
                .build();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        UserInfo userInfo=userInfoRepository.findById(id).orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
        userRepository.deleteUserByUserName(userInfo.getUserName());
        userInfoRepository.deleteById(id);
    }

}
