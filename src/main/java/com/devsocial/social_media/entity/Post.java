package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MAIN_POSTS")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post extends EntityBase {
    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "USER_ID")
    private Long userInfoId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "LIKE_TOTAL")
    private Long likeTotal;

    @Column(name = "COMMENT_TOTAL")
    private Long commentTotal;

    @Column(name = "SAVE_TOTAL")
    private Long saveTotal;

    @Column(name = "REPORT_TOTAL")
    private Long reportTotal;

    @PrePersist
    public void prePersist() {
        this.reportTotal = 0L;
        this.likeTotal = 0L;
        this.saveTotal = 0L;
        this.commentTotal = 0L;
        this.createdAt = LocalDateTime.now();
    }

}
