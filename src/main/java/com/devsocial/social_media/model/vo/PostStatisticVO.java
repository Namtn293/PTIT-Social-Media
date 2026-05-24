package com.devsocial.social_media.model.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostStatisticVO {
    private String fullName;
    private String content;
    private Long time;
    private String timeUnit;
}
