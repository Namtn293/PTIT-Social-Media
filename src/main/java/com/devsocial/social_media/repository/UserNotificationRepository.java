package com.devsocial.social_media.repository;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findByUserOrderByNotificationCreateAtDesc(User user);

    @Query("SELECT un FROM UserNotification un ORDER BY un.notification.createAt DESC")
    List<UserNotification> findAllByOrderByNotificationCreateAtDesc();

    @Query(value = "SELECT setval(pg_get_serial_sequence('main_user_notifications', 'id'), COALESCE((SELECT MAX(id) FROM main_user_notifications), 0) + 1, false)", nativeQuery = true)
    Object syncSequence();

    @Query("SELECT un FROM UserNotification un WHERE un.notification.id = :notificationId")
    List<UserNotification> findByNotificationId(@org.springframework.data.repository.query.Param("notificationId") Long notificationId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM UserNotification un WHERE un.notification.id = :notificationId")
    void deleteByNotificationId(@org.springframework.data.repository.query.Param("notificationId") Long notificationId);
}
