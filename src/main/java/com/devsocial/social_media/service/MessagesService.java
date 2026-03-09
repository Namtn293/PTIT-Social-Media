package com.devsocial.social_media.service;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Messages;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.dto.MessageUpdateDTO;

import java.util.List;

public interface MessagesService {
    Messages createMessage(MessageDTO messageDTO);
    Messages updateMessage(Long id,MessageUpdateDTO messageUpdateDTO) throws BusinessException;
    List<Messages> getAll();
    void deleteMessage(Long id,Long userId) throws BusinessException;
}
