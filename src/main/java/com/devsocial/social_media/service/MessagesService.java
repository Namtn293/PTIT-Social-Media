package com.devsocial.social_media.service;


import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.vo.MessageVO;

import java.util.List;

public interface MessagesService {
    MessageVO saveMessage(MessageDTO messageDTO);

    List<MessageVO> getAllMessages();

    MessageVO editMessage(Long id, MessageDTO messageDTO);

    MessageVO deleteMessage(Long id);
}
