package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comments;
import com.devsocial.social_media.entity.Posts;
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
    public Comments createComment(CommentDTO commentDTO) {
        Posts posts = postsRepository.findById(commentDTO.getPostId())
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        Comments comments = new Comments();
        comments.setPostId(commentDTO.getPostId());
        comments.setUserId(commentDTO.getUserId());
        comments.setContent(commentDTO.getContent());
        comments.prePersist();
        commentsRepository.save(comments);
        return comments;
    }

    @Override
    public List<Comments> getAllByPostId(Long postId) throws BusinessException {
        Posts posts = postsRepository.findById(postId)
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        List<Comments> comments = commentsRepository.findAllByPostId(postId);
        comments.sort(Comparator.comparing(Comments::getCreatedAt));
        return comments;
    }

    @Override
    public void deleteById(Long id, Long userId) {
        Comments comments = commentsRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.COMMENT_NOT_EXIST));
        if(!comments.getUserId().equals(userId)){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        commentsRepository.delete(comments);
    };

    @Override
    public Comments updateComment(Long id, CommentUpdateDTO commentUpdateDTO) {
        Comments comments = commentsRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.COMMENT_NOT_EXIST));
        if(!comments.getUserId().equals(commentUpdateDTO.getUserId())){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        comments.setContent(commentUpdateDTO.getContent());
        commentsRepository.save(comments);
        return comments;
    }
}
