package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageVO {
    private String avatar;
    private String timestamp;
    private String fullName;
    private String content;
    private Long userId;
    private String userName;
    private Long id;
    private String type; // CREATE, EDIT, DELETE
    private Boolean isEdited;

    public MessageVO(String avatar, String timestamp, String fullName, String content, Long userId, String userName, Long id, Boolean isEdited) {
        this.avatar = avatar;
        this.timestamp = timestamp;
        this.fullName = fullName;
        this.content = content;
        this.userId = userId;
        this.userName = userName;
        this.id = id;
        this.isEdited = isEdited != null && isEdited;
        this.type = "CREATE";
    }
}
