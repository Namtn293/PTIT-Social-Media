package com.devsocial.social_media.core.auth.service;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.model.dto.RegisterDTO;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.enumration.StatusEnum;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.UserInfoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public AuthenticationService(UserRepository userRepository,PasswordEncoder passwordEncoder,UserInfoRepository userInfoRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userInfoRepository = userInfoRepository;
    }

    @Transactional
    public void register(RegisterDTO registerDTO) throws BusinessException {
        if (userRepository.existsByUserName(registerDTO.getUserName())){
            throw new BusinessException(ErrorCode.USER_ALREADY_EXIST);
        }
        User user=new User();
        user.setUserName(registerDTO.getUserName());
        user.setRoleEnum(RoleEnum.STUDENT);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        userRepository.save(user);

        UserInfo userInfo=new UserInfo();
        userInfo.setUserName(registerDTO.getUserName());
        userInfo.setEmail(registerDTO.getEmail());
        userInfo.setFullName(registerDTO.getFullName());
        userInfo.setStatus(StatusEnum.ACTIVE);
        userInfoRepository.save(userInfo);
    }
}
