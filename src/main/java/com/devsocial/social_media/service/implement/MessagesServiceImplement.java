package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Messages;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.MessageDTO;
import com.devsocial.social_media.model.dto.MessageUpdateDTO;
import com.devsocial.social_media.repository.MessageRepository;
import com.devsocial.social_media.service.MessagesService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class MessagesServiceImplement implements MessagesService {
    private final MessageRepository messageRepository;

    public MessagesServiceImplement(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }


    @Override
    public Messages createMessage(MessageDTO messageDTO) {
        Messages message = new Messages();
        message.setContent(messageDTO.getContent());
        message.setUserId(messageDTO.getUserId());
        message.prePersist();
        messageRepository.save(message);
        return message;
    }

    @Override
    public Messages updateMessage(Long id, MessageUpdateDTO messageUpdateDTO) throws BusinessException {
        Messages message = messageRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.MESSAGE_NOT_EXIST));
        if(!message.getUserId().equals(messageUpdateDTO.getUserId())){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        message.setContent(messageUpdateDTO.getContent());
        messageRepository.save(message);
        return message;
    }

    @Override
    public List<Messages> getAll() {
        List<Messages> messages = messageRepository.findAll();
        messages.sort(Comparator.comparing(Messages::getCreatedAt));
        return messages;
    }

    @Override
    public void deleteMessage(Long id,Long userId) throws BusinessException {
        Messages message = messageRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.MESSAGE_NOT_EXIST));
        if(!message.getUserId().equals(userId)){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        messageRepository.delete(message);
    }
}
