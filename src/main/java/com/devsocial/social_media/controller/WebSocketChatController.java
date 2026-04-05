package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.vo.MessageVO;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class WebSocketChatController {
    private final MessagesService messagesService;
    private final com.devsocial.social_media.repository.UserInfoRepository userInfoRepository;

    public WebSocketChatController(MessagesService messagesService, com.devsocial.social_media.repository.UserInfoRepository userInfoRepository) {
        this.messagesService = messagesService;
        this.userInfoRepository = userInfoRepository;
    }

    @MessageMapping("/chat-community")
    @SendTo("/topic/public")
    public MessageVO chatMessage(@Payload MessageDTO messageDTO, Principal principal){
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) principal;
            if (authToken.getPrincipal() instanceof com.devsocial.social_media.core.auth.entity.User) {
                User user = (User) authToken.getPrincipal();

                Long profileId = userInfoRepository.findIdByUserName(user.getUsername()).orElse(null);
                messageDTO.setUserId(profileId);
            }
        }
        return messagesService.saveMessage(messageDTO);
    }
}
