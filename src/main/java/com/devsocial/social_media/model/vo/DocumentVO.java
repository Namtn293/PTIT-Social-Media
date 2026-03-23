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
    private String title;
    private String fileURL;
    private String ImageURL;
    private Long subjectId;
}
