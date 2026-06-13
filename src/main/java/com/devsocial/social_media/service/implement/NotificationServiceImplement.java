package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Notification;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.entity.UserNotification;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.enumration.RoleEnum;
import com.devsocial.social_media.model.dto.NotificationCreateDTO;
import com.devsocial.social_media.model.vo.NotificationAdminVO;
import com.devsocial.social_media.model.vo.NotificationUserVO;
import com.devsocial.social_media.repository.NotificationRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.repository.UserNotificationRepository;
import com.devsocial.social_media.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImplement implements NotificationService {

    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final NotificationRepository notificationRepository;
    private final UserNotificationRepository userNotificationRepository;

    @Autowired
    public NotificationServiceImplement(UserRepository userRepository,
                                        UserInfoRepository userInfoRepository,
                                        NotificationRepository notificationRepository,
                                        UserNotificationRepository userNotificationRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.notificationRepository = notificationRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    @jakarta.annotation.PostConstruct
    public void syncSequences() {
        try {
            notificationRepository.syncSequence();
        } catch (Exception e) {
            System.err.println("Failed to sync main_notifications sequence: " + e.getMessage());
        }
        try {
            userNotificationRepository.syncSequence();
        } catch (Exception e) {
            System.err.println("Failed to sync main_user_notifications sequence: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void createNotification(NotificationCreateDTO dto) {
        String adminUserName = ThreadContext.getUserDetail().getUsername();
        User adminUser = userRepository.findByUserName(adminUserName)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Notification notification = Notification.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .createAt(LocalDateTime.now())
                .createBy(adminUser.getId().toString())
                .build();

        notificationRepository.save(notification);

        if ("-1".equals(dto.getUserName())) {
            // Send to all STUDENT users
            List<User> students = userRepository.findByRoleEnum(RoleEnum.STUDENT);
            List<UserNotification> userNotifications = new ArrayList<>();
            for (User student : students) {
                userNotifications.add(UserNotification.builder()
                        .isRead(false)
                        .user(student)
                        .notification(notification)
                        .build());
            }
            userNotificationRepository.saveAll(userNotifications);
        } else {
            // Send to specific user
            User targetUser = userRepository.findByUserName(dto.getUserName())
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            UserNotification userNotification = UserNotification.builder()
                    .isRead(false)
                    .user(targetUser)
                    .notification(notification)
                    .build();

            userNotificationRepository.save(userNotification);
        }
    }

    @Override
    public List<NotificationUserVO> getMyNotifications() {
        String userName = ThreadContext.getUserDetail().getUsername();
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        List<UserNotification> list = userNotificationRepository.findByUserOrderByNotificationCreateAtDesc(user);
        List<NotificationUserVO> result = new ArrayList<>();

        for (UserNotification un : list) {
            Notification notif = un.getNotification();
            String creatorDisplayName = "Hệ thống";

            if (notif.getCreateBy() != null) {
                try {
                    Long adminId = Long.parseLong(notif.getCreateBy());
                    Optional<User> adminOpt = userRepository.findById(adminId);
                    if (adminOpt.isPresent()) {
                        String adminUserNm = adminOpt.get().getUsername();
                        Optional<UserInfo> adminInfoOpt = userInfoRepository.findByUserName(adminUserNm);
                        if (adminInfoOpt.isPresent() && adminInfoOpt.get().getFullName() != null) {
                            creatorDisplayName = adminInfoOpt.get().getFullName();
                        } else {
                            creatorDisplayName = adminUserNm;
                        }
                    }
                } catch (NumberFormatException ignored) {}
            }

            String displayTitle = notif.getTitle();
            String displayContent = notif.getContent();
            if ((displayTitle == null || displayTitle.isEmpty()) && displayContent != null && displayContent.contains(": ")) {
                int colonIdx = displayContent.indexOf(": ");
                displayTitle = displayContent.substring(0, colonIdx);
                displayContent = displayContent.substring(colonIdx + 2);
            }

            result.add(NotificationUserVO.builder()
                    .id(un.getId())
                    .title(displayTitle != null ? displayTitle : "")
                    .content(displayContent != null ? displayContent : "")
                    .createAt(notif.getCreateAt())
                    .createBy(creatorDisplayName)
                    .isRead(un.getIsRead())
                    .build());
        }

        return result;
    }

    @Override
    public List<NotificationAdminVO> getAllNotifications() {
        List<Notification> list = notificationRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createAt"));
        List<NotificationAdminVO> result = new ArrayList<>();

        for (Notification notif : list) {
            List<UserNotification> userNotifs = userNotificationRepository.findByNotificationId(notif.getId());
            String recipient = "Không xác định";
            if (userNotifs.size() == 1) {
                recipient = userNotifs.get(0).getUser().getUsername();
            } else if (userNotifs.size() > 1) {
                recipient = "Tất cả mọi người";
            }

            String displayTitle = notif.getTitle();
            String displayContent = notif.getContent();
            if ((displayTitle == null || displayTitle.isEmpty()) && displayContent != null && displayContent.contains(": ")) {
                int colonIdx = displayContent.indexOf(": ");
                displayTitle = displayContent.substring(0, colonIdx);
                displayContent = displayContent.substring(colonIdx + 2);
            }

            result.add(NotificationAdminVO.builder()
                    .id(notif.getId())
                    .title(displayTitle != null ? displayTitle : "")
                    .content(displayContent != null ? displayContent : "")
                    .userName(recipient)
                    .createAt(notif.getCreateAt())
                    .build());
        }

        return result;
    }

    @Override
    @Transactional
    public void deleteNotification(Long id) {
        userNotificationRepository.deleteByNotificationId(id);
        notificationRepository.deleteById(id);
    }
}
