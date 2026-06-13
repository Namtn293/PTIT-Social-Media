package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsVO {
    private Long newUsersCount;
    private String newUsersGrowth;
    private Long newPostsCount;
    private String newPostsGrowth;
    private Long newDocumentsCount;
    private String newDocumentsGrowth;
    private Long newNotificationsCount;
    private String newNotificationsGrowth;
}
