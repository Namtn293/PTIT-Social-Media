package com.devsocial.social_media.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentVO {
    private Long id;
    private String title;
    private String fileURL;
    private String ImageURL;
    private String uploaderName;
    private String size;
    private String createdAt;
    private String createBy;
}
