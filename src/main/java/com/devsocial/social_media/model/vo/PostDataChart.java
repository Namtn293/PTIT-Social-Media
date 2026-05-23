package com.devsocial.social_media.model.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostDataChart {
    private String date;
    private Long posts;
}
