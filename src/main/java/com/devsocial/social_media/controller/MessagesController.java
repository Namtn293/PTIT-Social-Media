package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.vo.MessageVO;
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

    @GetMapping("/get/all")
    public SuccessResponse<List<MessageVO>> getAll(){
        return ResponseUtil.ok("get all message success", messagesService.getAllMessages());
    }
}
