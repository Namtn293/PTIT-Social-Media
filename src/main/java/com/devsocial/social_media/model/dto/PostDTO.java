package com.devsocial.social_media.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class PostDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;
}
