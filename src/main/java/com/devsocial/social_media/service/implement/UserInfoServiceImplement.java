package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Classes;
import com.devsocial.social_media.entity.Major;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.enumration.StatusEnum;
import com.devsocial.social_media.model.dto.UserInfoDTO;
import com.devsocial.social_media.model.vo.UserInfoAdminVO;
import com.devsocial.social_media.model.vo.UserInfoManagementVO;
import com.devsocial.social_media.model.vo.UserInfoVO;
import com.devsocial.social_media.repository.ClassesRepository;
import com.devsocial.social_media.repository.MajorRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.UserInfoService;
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
    private final MajorRepository majorRepository;
    private final ClassesRepository classesRepository;
    private final UserRepository userRepository;
    public UserInfoServiceImplement(UserRepository userRepository,ClassesRepository classesRepository,MajorRepository majorRepository,UserInfoRepository userInfoRepository, CloudinaryServiceImplement cloudinaryServiceImplement, ImagesServiceImplement imageImplement) {
        this.userInfoRepository = userInfoRepository;
        this.cloudinaryServiceImplement = cloudinaryServiceImplement;
        this.imageImplement = imageImplement;
        this.classesRepository = classesRepository;
        this.majorRepository = majorRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<UserInfoManagementVO> getAllUserInfo() {
        List<UserInfoManagementVO> uiaVOS = new ArrayList<>();
        List<UserInfo> list=userInfoRepository.findAll();
        list.forEach(c->{
            if(userRepository.findByUserName(c.getUserName())
                    .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND)).getRole()== RoleEnum.STUDENT){
                UserInfoManagementVO vo=UserInfoManagementVO.builder()
                        .role(userRepository.findRoleEnumByUserName(c.getUserName()))
                        .status(c.getStatus())
                        .userName(c.getUserName())
                        .userId(c.getId())
                        .email(c.getEmail())
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
        Classes classes=classesRepository.findById(userInfo.getClassId()).orElseThrow(()-> new BusinessException(ErrorCode.CLASS_NOT_EXIST));
        Major major=majorRepository.findById(classes.getMajorId()).orElseThrow(()-> new BusinessException(ErrorCode.MAJOR_NOT_EXIST));
        return UserInfoAdminVO.builder()
                .id(userInfo.getId())
                .userName(userInfo.getUserName())
                .fullName(userInfo.getFullName())
                .imageId(userInfo.getImageId())
                .email(userInfo.getEmail())
                .status(userInfo.getStatus())
                .major(major.getMajorName())
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
