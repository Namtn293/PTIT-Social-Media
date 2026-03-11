package com.devsocial.social_media.core.auth.service;

import com.devsocial.social_media.core.auth.entity.Token;
import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.model.dto.LoginDTO;
import com.devsocial.social_media.core.auth.model.dto.RegisterDTO;
import com.devsocial.social_media.core.auth.repository.TokenRepository;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.enumration.StatusEnum;
import com.devsocial.social_media.repository.UserInfoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserInfoRepository userInfoRepository;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;

    @Autowired
    public AuthenticationService(TokenRepository tokenRepository,JwtService jwtService,UserRepository userRepository,PasswordEncoder passwordEncoder,UserInfoRepository userInfoRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userInfoRepository = userInfoRepository;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
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

    public String login(LoginDTO dto)throws BusinessException{
        User user=userRepository.findByUserName(dto.getUserName())
                .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
        if (!passwordEncoder.matches(dto.getPassword(),user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_NOT_CORRECT);
        }
        String token=jwtService.buildAccessToken(user);
        revokedToken(user.getId());
        Token token1=Token.builder()
                .token(token)
                .userId(user.getId())
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token1);
        return token;
    }

    public void revokedToken(Long userId){
        List<Token> tokens=tokenRepository.findByUserId(userId);
        if (tokens.isEmpty()) return;
        tokens.forEach(c->{
            c.setRevoked(true);
            c.setExpired(true);
            tokenRepository.save(c);
        });
    }

    public void logout(String token)throws BusinessException{
        Token jwt=tokenRepository.findByToken(token).orElseThrow(
            ()-> new BusinessException(ErrorCode.TOKEN_NOT_EXIST));
        jwt.setExpired(true);
        jwt.setRevoked(true);
        tokenRepository.save(jwt);
    }
}
