package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.model.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte @Nullable [] pattern) {
        try{
            String json=new String(message.getBody());
            NotificationMessage notificationMessage=objectMapper.readValue(json,NotificationMessage.class);
            log.info("Redis nhận được message từ user "+notificationMessage.getSenderName());

            simpMessagingTemplate.convertAndSendToUser(notificationMessage.getTargetUsername(),
                    "/queue/notifications",
                    notificationMessage);

        } catch (Exception err) {
            log.error("Lỗi xử lý " + err.getMessage());
        }
    }
}
