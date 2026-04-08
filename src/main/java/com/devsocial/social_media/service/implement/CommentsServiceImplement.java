package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comment;
import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.dto.CommentUpdateDTO;
import com.devsocial.social_media.repository.CommentsRepository;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.service.CommentsService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class CommentsServiceImplement implements CommentsService {
    private final CommentsRepository commentsRepository;
    private final PostsRepository postsRepository;

    public CommentsServiceImplement(CommentsRepository commentsRepository, PostsRepository postsRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
    }

    @Override
    public Comment createComment(CommentDTO commentDTO) {
        Post post = postsRepository.findById(commentDTO.getPostId())
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        Comment comment = new Comment();
        comment.setPostId(commentDTO.getPostId());
        comment.setUserId(commentDTO.getUserId());
        comment.setContent(commentDTO.getContent());
        comment.prePersist();
        commentsRepository.save(comment);
        return comment;
    }

    @Override
    public List<Comment> getAllByPostId(Long postId) throws BusinessException {
        Post post = postsRepository.findById(postId)
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        List<Comment> comments = commentsRepository.findAllByPostId(postId);
        comments.sort(Comparator.comparing(Comment::getCreatedAt));
        return comments;
    }

    @Override
    public void deleteById(Long id, Long userId) {
        Comment comment = commentsRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.COMMENT_NOT_EXIST));
        if(!comment.getUserId().equals(userId)){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        commentsRepository.delete(comment);
    };

    @Override
    public Comment updateComment(Long id, CommentUpdateDTO commentUpdateDTO) {
        Comment comment = commentsRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.COMMENT_NOT_EXIST));
        if(!comment.getUserId().equals(commentUpdateDTO.getUserId())){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        comment.setContent(commentUpdateDTO.getContent());
        commentsRepository.save(comment);
        return comment;
    }
}
