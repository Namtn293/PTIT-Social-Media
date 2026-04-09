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
    private LocalDateTime createAt;
    private String author;
    private String className;
    private Long likeTotal;
    private Long commentTotal;
    private Long saveTotal;
    private Long reportTotal;
    private Long postId;
}
