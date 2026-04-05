package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Messages;
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

    public MessagesServiceImplement(ImageRepository imageRepository, UserInfoRepository userInfoRepository,
            MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
        this.userInfoRepository = userInfoRepository;
        this.imageRepository = imageRepository;
    }

    @Override
    public MessageVO saveMessage(MessageDTO messageDTO) {
        Messages messages = Messages.builder()
                .userId(messageDTO.getUserId())
                .content(messageDTO.getContent())
                .build();
        messageRepository.save(messages);

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
                .timestamp(messages.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .build();
    }

    @Override
    public List<MessageVO> getAllMessages() {
        List<Messages> list = messageRepository.findAllByOrderByCreatedAtAsc();
        List<MessageVO> messageVOS = new ArrayList<>();
        list.forEach(c -> {
            String fullName = "Cộng đồng";
            String avatar = null;
            if (c.getUserId() != null) {
                UserInfo userInfo = userInfoRepository.findById(c.getUserId()).orElse(null);
                if (userInfo != null) {
                    if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                    if (userInfo.getImageId() != null) {
                        avatar = imageRepository.findAvatarById(userInfo.getImageId());
                    }
                }
            }
            
            MessageVO messageVO = MessageVO.builder()
                    .userId(c.getUserId() == null ? 0L : c.getUserId())
                    .content(c.getContent())
                    .timestamp(c.getCreatedAt())
                    .fullName(fullName)
                    .avatar(avatar)
                    .build();
            messageVOS.add(messageVO);
        });
        return messageVOS;
    }
}
