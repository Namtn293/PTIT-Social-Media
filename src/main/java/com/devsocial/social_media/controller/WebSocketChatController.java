package com.devsocial.social_media.controller;

import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.vo.MessageVO;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class WebSocketChatController {
    private final MessagesService messagesService;
    public WebSocketChatController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @MessageMapping("/chat-community")
    @SendTo("/topic/public")
    public MessageVO chatMessage(@Payload MessageDTO messageDTO, Principal principal){
        return messagesService.saveMessage(messageDTO);
    }
}
