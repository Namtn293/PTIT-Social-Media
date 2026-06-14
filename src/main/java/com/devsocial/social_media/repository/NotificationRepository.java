package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query(value = "SELECT setval(pg_get_serial_sequence('main_notifications', 'id'), COALESCE((SELECT MAX(id) FROM main_notifications), 0) + 1, false)", nativeQuery = true)
    Object syncSequence();

    @Query(value = """
            select count(u)
            from main_notifications u
            where extract(month from u.create_at)=extract(month from now())
            and extract(year from u.create_at)=extract(year from now())
            """,nativeQuery = true)
    Long getNotificationTotalInThisMonth();

    @Query(value = """
            select count(u)
            from main_notifications u
            where u.create_at>=date_trunc('month',current_date- interval'1 month')
            and u.create_at<date_trunc('month',current_date)
            """,nativeQuery = true)
    Long getNotificationTotalInLastMonth();
}
