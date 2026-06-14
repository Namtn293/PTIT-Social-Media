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

import java.util.*;

@Service
public class MessagesServiceImplement implements MessagesService {
    private final MessageRepository messageRepository;
    private final UserInfoRepository userInfoRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public MessagesServiceImplement(ImageRepository imageRepository, UserInfoRepository userInfoRepository,
            MessageRepository messageRepository, UserRepository userRepository) {
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
            User user = userRepository.findById(messageDTO.getUserId()).orElse(null);
            if (user != null) {
                UserInfo userInfo = userInfoRepository.findByUserName(user.getUsername()).orElse(null);
                if (userInfo != null) {
                    if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                    if (userInfo.getImageId() != null) {
                        avatar = imageRepository.findAvatarById(userInfo.getImageId());
                    }
                    userName = userInfo.getUserName();
                }
            }
        }

        return MessageVO.builder()
                .id(message.getId())
                .userId(messageDTO.getUserId() == null ? 0L : messageDTO.getUserId())
                .content(messageDTO.getContent())
                .timestamp(message.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .userName(userName)
                .type("CREATE")
                .isEdited(false)
                .build();
    }

    @Override
    public List<MessageVO> getAllMessages() {
        return messageRepository.findAllAsVO();
    }

    @Override
    public MessageVO editMessage(Long id, MessageDTO messageDTO) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MESSAGE_NOT_EXIST));

        User currentUser = (User) com.devsocial.social_media.core.configuration.ThreadContext.getUserDetail();
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        if ("[DELETED_BY_USER]".equals(message.getContent()) || "[DELETED_BY_ADMIN]".equals(message.getContent())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        if (message.getIsEdited() != null && message.getIsEdited()) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        if (!message.getUserId().equals(currentUser.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (isOlderThanOneHour(message.getCreatedAt())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        message.setContent(messageDTO.getContent());
        message.setIsEdited(true);
        messageRepository.save(message);

        String fullName = "Cộng đồng";
        String avatar = null;
        String userName = currentUser.getUsername();

        UserInfo userInfo = userInfoRepository.findByUserName(userName).orElse(null);
        if (userInfo != null) {
            if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
            if (userInfo.getImageId() != null) {
                avatar = imageRepository.findAvatarById(userInfo.getImageId());
            }
        }

        return MessageVO.builder()
                .id(message.getId())
                .userId(message.getUserId())
                .content(message.getContent())
                .timestamp(message.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .userName(userName)
                .type("EDIT")
                .isEdited(true)
                .build();
    }

    @Override
    public MessageVO deleteMessage(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MESSAGE_NOT_EXIST));

        User currentUser = (User) com.devsocial.social_media.core.configuration.ThreadContext.getUserDetail();
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        if ("[DELETED_BY_USER]".equals(message.getContent()) || "[DELETED_BY_ADMIN]".equals(message.getContent())) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        boolean isOwner = message.getUserId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == com.devsocial.social_media.enumration.RoleEnum.ADMIN;

        // If not ADMIN, check owner and <= 1 hour old.
        if (!isAdmin) {
            if (!isOwner) {
                throw new BusinessException(ErrorCode.FORBIDDEN);
            }
            if (isOlderThanOneHour(message.getCreatedAt())) {
                throw new BusinessException(ErrorCode.FORBIDDEN);
            }
        }

        if (isOwner) {
            message.setContent("[DELETED_BY_USER]");
        } else {
            message.setContent("[DELETED_BY_ADMIN]");
        }
        messageRepository.save(message);

        String fullName = "Cộng đồng";
        String avatar = null;
        String userName = "";

        User author = userRepository.findById(message.getUserId()).orElse(null);
        if (author != null) {
            userName = author.getUsername();
            UserInfo userInfo = userInfoRepository.findByUserName(userName).orElse(null);
            if (userInfo != null) {
                if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                if (userInfo.getImageId() != null) {
                    avatar = imageRepository.findAvatarById(userInfo.getImageId());
                }
            }
        }

        return MessageVO.builder()
                .id(message.getId())
                .userId(message.getUserId())
                .content(message.getContent())
                .timestamp(message.getCreatedAt())
                .fullName(fullName)
                .avatar(avatar)
                .userName(userName)
                .type("EDIT")
                .isEdited(message.getIsEdited() != null && message.getIsEdited())
                .build();
    }

    private boolean isOlderThanOneHour(String createdAtStr) {
        if (createdAtStr == null) return false;
        try {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy");
            java.time.LocalDateTime createdAt = java.time.LocalDateTime.parse(createdAtStr, formatter);
            return createdAt.plusHours(1).isBefore(java.time.LocalDateTime.now());
        } catch (Exception e) {
            return true;
        }
    }
}
