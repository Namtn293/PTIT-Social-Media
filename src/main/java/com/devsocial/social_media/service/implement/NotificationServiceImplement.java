package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.model.vo.GeneralCountHomeVO;
import com.devsocial.social_media.repository.NotificationRepository;
import com.devsocial.social_media.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImplement implements NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationServiceImplement(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public GeneralCountHomeVO getNotificationTotal() {
        Long notificationTotalInThisMonth=notificationRepository.getNotificationTotalInThisMonth();
        Long notificationTotalInLastMonth=notificationRepository.getNotificationTotalInLastMonth();
        String status=notificationTotalInLastMonth>notificationTotalInThisMonth ? "Decrease" : "Increase";
        double percentage=notificationTotalInLastMonth!=0 ? Math.abs((double) (notificationTotalInThisMonth-notificationTotalInLastMonth)/notificationTotalInLastMonth)*100.0 :0.0;
        return GeneralCountHomeVO.builder()
                .count(notificationTotalInThisMonth)
                .percentage(Math.round(percentage*10.0)/10.0)
                .status(status)
                .build();
    }
}
