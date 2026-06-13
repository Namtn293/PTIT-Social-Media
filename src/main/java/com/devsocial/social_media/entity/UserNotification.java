package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MAIN_USER_NOTIFICATIONS")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserNotification extends EntityBase {

    @Column(name = "IS_READ")
    private Boolean isRead;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "NOTIFICATION_ID", nullable = false)
    private Notification notification;
}
