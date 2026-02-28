package com.devsocial.social_media.model.vo;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Getter
@NoArgsConstructor
public class PostVO {
    String title;
    String content;
    String subject;
    LocalDateTime createAt;
    String author;

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
