package com.devsocial.social_media.model.vo;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@Builder
public class PostVO {
    private String title;
    private String content;
    private LocalDateTime time;
    private String name;
    private String classes;
    private Long likes;
    private Long comments;
    private Long saves;
    private Long report;
    private Long id;
    private String userName;
    private String avatar;
    private Boolean liked;
    private Boolean saved;
    private Boolean reported;

    // Constructor matching the existing JPQL queries
    public PostVO(String title, String content, LocalDateTime time, String name, String classes,
                  Long likes, Long comments, Long saves, Long report, Long id, String userName, String avatar) {
        this.title = title;
        this.content = content;
        this.time = time;
        this.name = name;
        this.classes = classes;
        this.likes = likes;
        this.comments = comments;
        this.saves = saves;
        this.report = report;
        this.id = id;
        this.userName = userName;
        this.avatar = avatar;
        this.liked = false;
        this.saved = false;
        this.reported = false;
    }

    // All-args constructor for Builder / complete mappings
    public PostVO(String title, String content, LocalDateTime time, String name, String classes,
                  Long likes, Long comments, Long saves, Long report, Long id, String userName, String avatar,
                  Boolean liked, Boolean saved, Boolean reported) {
        this.title = title;
        this.content = content;
        this.time = time;
        this.name = name;
        this.classes = classes;
        this.likes = likes;
        this.comments = comments;
        this.saves = saves;
        this.report = report;
        this.id = id;
        this.userName = userName;
        this.avatar = avatar;
        this.liked = liked;
        this.saved = saved;
        this.reported = reported;
    }
}
