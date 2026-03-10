package com.devsocial.social_media.service;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comments;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.dto.CommentUpdateDTO;

import java.util.List;

public interface CommentsService {
    Comments createComment(CommentDTO commentDTO);
    List<Comments> getAllByPostId(Long postId) throws BusinessException;
    void deleteById(Long id,Long userId);
    Comments updateComment(Long id, CommentUpdateDTO commentUpdateDTO);
}
