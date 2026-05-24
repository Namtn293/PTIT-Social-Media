package com.devsocial.social_media.service;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comment;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.dto.CommentUpdateDTO;
import com.devsocial.social_media.model.vo.CommentVO;

import java.util.List;

public interface CommentsService {
    Comment createComment(CommentDTO commentDTO);
    List<CommentVO> getAllByPostId(Long postId) throws BusinessException;
    void deleteById(Long id,Long userId);
    Comment updateComment(Long id, CommentUpdateDTO commentUpdateDTO);
}
