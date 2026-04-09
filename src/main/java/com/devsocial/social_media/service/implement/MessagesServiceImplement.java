package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Message;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.vo.MessageVO;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.MessageRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessagesServiceImplement implements MessagesService {
    private final MessageRepository messageRepository;
    private final UserInfoRepository userInfoRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public MessagesServiceImplement(UserRepository userRepository,ImageRepository imageRepository, UserInfoRepository userInfoRepository,
            MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
        this.userInfoRepository = userInfoRepository;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public MessageVO saveMessage(MessageDTO messageDTO) {
        Message message = Message.builder()
                .userId(messageDTO.getUserId())
                .content(messageDTO.getContent())
                .build();
        messageRepository.save(message);

        String fullName = "Cộng đồng";
        String avatar = null;
        if (messageDTO.getUserId() != null) {
            UserInfo userInfo = userInfoRepository.findById(messageDTO.getUserId()).orElse(null);
            if (userInfo != null) {
                if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                if (userInfo.getImageId() != null) {
                    avatar = imageRepository.findAvatarById(userInfo.getImageId());
                }
            }
        }

        return MessageVO.builder()
                .userId(messageDTO.getUserId() == null ? 0L : messageDTO.getUserId())
                .content(messageDTO.getContent())
                .timestamp(message.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .build();
    }

    @Override
    public List<MessageVO> getAllMessages() {
        List<Message> list = messageRepository.findAllByOrderByCreatedAtAsc();
        List<MessageVO> messageVOS = new ArrayList<>();
        list.forEach(c -> {
            String fullName = "Cộng đồng";
            String avatar = null,userName="";
            if (c.getUserId() != null) {
                User user=userRepository.findById(c.getUserId()).orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
                UserInfo userInfo = userInfoRepository.findByUserName(user.getUsername()).orElse(null);
                if (userInfo != null) {
                    if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                    if (userInfo.getImageId() != null) {
                        avatar = imageRepository.findAvatarById(userInfo.getImageId());
                    }
                    userName=userInfo.getUserName();
                }
            }
            
            MessageVO messageVO = MessageVO.builder()
                    .userId(c.getUserId() == null ? 0L : c.getUserId())
                    .content(c.getContent())
                    .timestamp(c.getCreatedAt())
                    .fullName(fullName)
                    .avatar(avatar)
                    .userName(userName)
                    .build();
            messageVOS.add(messageVO);
        });
        return messageVOS;
    }
}
