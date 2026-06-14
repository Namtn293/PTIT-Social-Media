package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.vo.MessageVO;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessagesController {
    private final MessagesService messagesService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessagesController(MessagesService messagesService, SimpMessagingTemplate messagingTemplate) {
        this.messagesService = messagesService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/get/all")
    public SuccessResponse<List<MessageVO>> getAll(){
        return ResponseUtil.ok("get all message success", messagesService.getAllMessages());
    }

    @PutMapping("/edit/{id}")
    public SuccessResponse<MessageVO> editMessage(@PathVariable Long id, @RequestBody MessageDTO messageDTO) {
        MessageVO updatedMessage = messagesService.editMessage(id, messageDTO);
        messagingTemplate.convertAndSend("/topic/public", updatedMessage);
        return ResponseUtil.ok("edit message success", updatedMessage);
    }

    @DeleteMapping("/delete/{id}")
    public SuccessResponse<MessageVO> deleteMessage(@PathVariable Long id) {
        MessageVO deletedMessage = messagesService.deleteMessage(id);
        messagingTemplate.convertAndSend("/topic/public", deletedMessage);
        return ResponseUtil.ok("delete message success", deletedMessage);
    }
}
