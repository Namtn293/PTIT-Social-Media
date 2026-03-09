package com.devsocial.social_media.service;

import com.devsocial.social_media.entity.Comments;
import com.devsocial.social_media.model.dto.CommentDTO;

import java.util.List;

public interface CommentsService {
    Comments createComment(CommentDTO commentDTO);
    List<Comments> getAllByPostId(Long postId);
    void deleteById(Long id,Long userId);
    Comments updateComment(Long id,Long userId,String content);
}
