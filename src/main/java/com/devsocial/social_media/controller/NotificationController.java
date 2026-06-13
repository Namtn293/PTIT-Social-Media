package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.NotificationCreateDTO;
import com.devsocial.social_media.model.vo.NotificationAdminVO;
import com.devsocial.social_media.model.vo.NotificationUserVO;
import com.devsocial.social_media.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/create")
    public SuccessResponse<String> createNotification(@RequestBody NotificationCreateDTO dto) {
        notificationService.createNotification(dto);
        return ResponseUtil.ok("Notification created successfully");
    }

    @GetMapping("/my")
    public SuccessResponse<List<NotificationUserVO>> getMyNotifications() {
        return ResponseUtil.ok("Get user notifications successfully", notificationService.getMyNotifications());
    }

    @GetMapping("/all")
    public SuccessResponse<List<NotificationAdminVO>> getAllNotifications() {
        return ResponseUtil.ok("Get all notifications successfully", notificationService.getAllNotifications());
    }

    @PostMapping("/delete/{id}")
    public SuccessResponse<String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseUtil.ok("Notification deleted successfully");
    }
}
