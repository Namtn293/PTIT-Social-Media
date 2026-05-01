package com.devsocial.social_media.model.vo;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Getter
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
}
