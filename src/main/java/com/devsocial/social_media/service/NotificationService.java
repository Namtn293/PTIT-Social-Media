package com.devsocial.social_media.service;

import com.devsocial.social_media.model.dto.NotificationCreateDTO;
import com.devsocial.social_media.model.vo.NotificationAdminVO;
import com.devsocial.social_media.model.vo.NotificationUserVO;

import java.util.List;

public interface NotificationService {
    void createNotification(NotificationCreateDTO dto);
    List<NotificationUserVO> getMyNotifications();
    List<NotificationAdminVO> getAllNotifications();
    void deleteNotification(Long id);
}
