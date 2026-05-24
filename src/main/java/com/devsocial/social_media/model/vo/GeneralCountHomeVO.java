package com.devsocial.social_media.model.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GeneralCountHomeVO {
    private Long count;
    private double percentage;
    private String status;
}
