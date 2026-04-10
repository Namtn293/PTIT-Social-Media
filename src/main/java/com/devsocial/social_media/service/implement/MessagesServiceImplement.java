package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Image;
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
import java.util.stream.Collectors;

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
        String userName = "";
        if (messageDTO.getUserId() != null) {
            UserInfo userInfo = userInfoRepository.findById(messageDTO.getUserId()).orElse(null);
            if (userInfo != null) {
                if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                if (userInfo.getImageId() != null) {
                    avatar = imageRepository.findAvatarById(userInfo.getImageId());
                }
                userName = userInfo.getUserName();
            }
        }

        return MessageVO.builder()
                .userId(messageDTO.getUserId() == null ? 0L : messageDTO.getUserId())
                .content(messageDTO.getContent())
                .timestamp(message.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .userName(userName)
                .build();
    }

    @Override
    public List<MessageVO> getAllMessages() {
        List<Message> messages = messageRepository.findAllByOrderByCreatedAtAsc();
        if (messages.isEmpty()) {
            return new ArrayList<>();
        }

        // Collect unique userIds
        java.util.Set<Long> userIds = messages.stream()
                .map(Message::getUserId)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());

        // Batch fetch all UserInfo records
        java.util.Map<Long, UserInfo> userInfoMap = userInfoRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserInfo::getId, userInfo -> userInfo));

        // Batch fetch all relative Image URLs to eliminate N+1 for avatars
        java.util.Set<Long> imageIds = userInfoMap.values().stream()
                .map(UserInfo::getImageId)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());
        
        java.util.Map<Long, String> avatarMap = new java.util.HashMap<>();
        if (!imageIds.isEmpty()) {
            avatarMap = imageRepository.findAllById(imageIds).stream()
                    .collect(Collectors.toMap(Image::getId, Image::getUrl));
        }

        List<MessageVO> messageVOS = new ArrayList<>();
        for (Message c : messages) {
            String fullName = "Thành viên PTIT";
            String avatar = null;
            String userName = "";
            Long userId = c.getUserId();

            if (userId != null) {
                UserInfo userInfo = userInfoMap.get(userId);
                if (userInfo != null) {
                    if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                    if (userInfo.getImageId() != null) {
                        avatar = avatarMap.get(userInfo.getImageId());
                    }
                    userName = userInfo.getUserName();
                } else {
                    // Falls back to "Thành viên PTIT" if userInfo not found, instead of crashing
                    fullName = "Cựu thành viên";
                }
            }
            
            MessageVO messageVO = MessageVO.builder()
                    .userId(userId == null ? 0L : userId)
                    .content(c.getContent())
                    .timestamp(c.getCreatedAt())
                    .fullName(fullName)
                    .avatar(avatar)
                    .userName(userName)
                    .build();
            messageVOS.add(messageVO);
        }
        return messageVOS;
    }
}
