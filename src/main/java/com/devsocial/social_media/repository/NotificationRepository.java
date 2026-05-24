package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long> {
    @Query(value = """
            select count(u)
            from main_notifications u
            where extract(month from u.created_at)=extract(month from now())
            and extract(year from u.created_at)=extract(year from now())
            """,nativeQuery = true)
    Long getNotificationTotalInThisMonth();

    @Query(value = """
            select count(u)
            from main_notifications u
            where u.created_at>=date_trunc('month',current_date- interval'1 month')
            and u.created_at<date_trunc('month',current_date)
            """,nativeQuery = true)
    Long getNotificationTotalInLastMonth();
}
