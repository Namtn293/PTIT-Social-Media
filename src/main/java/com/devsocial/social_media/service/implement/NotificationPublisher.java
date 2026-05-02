package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.configuration.RedisConfig;
import com.devsocial.social_media.model.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPublisher {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public void publish(String targetUsername, String content, String type) {
        try {
            NotificationMessage message = NotificationMessage.builder()
                    .targetUsername(targetUsername)
                    .senderName("Admin")
                    .content(content)
                    .type(type)
                    .postId(null)
                    .createdAt(LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")))
                    .build();

            String json = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend(RedisConfig.NOTIFICATION_CHANNEL, json);
            log.info("Đã publish thông báo Redis tới user '{}'", targetUsername);
        } catch (Exception e) {
            log.error("Lỗi publish Redis: {}", e.getMessage(), e);
        }
    }
}
