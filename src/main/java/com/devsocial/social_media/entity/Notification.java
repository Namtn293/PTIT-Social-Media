package com.devsocial.social_media.entity;

import com.devsocial.social_media.core.util.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "MAIN_NOTIFICATIONS")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends EntityBase {

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATE_AT")
    private LocalDateTime createAt;

    @Column(name = "CREATE_BY")
    private String createBy;
}
