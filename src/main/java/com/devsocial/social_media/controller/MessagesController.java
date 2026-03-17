package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.entity.Messages;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.dto.MessageUpdateDTO;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessagesController {
    private final MessagesService messagesService;

    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/create")
    public SuccessResponse<Messages> createMessage(@RequestBody MessageDTO messageDTO){
        return ResponseUtil.ok(
                "create message success",
                messagesService.createMessage(messageDTO)
        );
    }

    @PostMapping("/update/{id}")
    public SuccessResponse<Messages> updateMessage(@PathVariable Long id, @RequestBody MessageUpdateDTO messageUpdateDTO){
        return ResponseUtil.ok(
                "update message success",
                messagesService.updateMessage(id,messageUpdateDTO)
        );
    }

    @PostMapping("/get/all")
    public SuccessResponse<List<Messages>> getAll(){
        return ResponseUtil.ok(
                "get all message success",
                messagesService.getAll()
        );
    }

    @PostMapping("/delete/{id}/{userId}")
    public SuccessResponse<String> deleteMessage(@PathVariable Long id,@PathVariable Long userId){
        messagesService.deleteMessage(id,userId);
        return ResponseUtil.ok(
                "delete message success",
                null
        );
    }
}
