package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comments;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.repository.CommentsRepository;
import com.devsocial.social_media.service.CommentsService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class CommentsServiceImplement implements CommentsService {
    private final CommentsRepository commentsRepository;

    public CommentsServiceImplement(CommentsRepository commentsRepository) {
        this.commentsRepository = commentsRepository;
    }

    @Override
    public Comments createComment(CommentDTO commentDTO) {
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
        List<Comments> comments = commentsRepository.findAllByPostId(postId).
                orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        if (comments.size()==0){
            throw new BusinessException(ErrorCode.POST_NOT_EXIST);
        }
        comments.sort(Comparator.comparing(Comments::getCreatedAt));
        return comments;
    }

    @Override
    public void deleteById(Long id, Long userId) {
        Comments comments = commentsRepository.findById(id)
                .orElseThrow(()->new RuntimeException("comment not found"));
        if(!comments.getUserId().equals(userId)){
            throw new RuntimeException("You do not have permission to delete this comment");
        }
        commentsRepository.delete(comments);
    };

    @Override
    public Comments updateComment(Long id, Long userId, String content) {
        Comments comments = commentsRepository.findById(id)
                .orElseThrow(()->new RuntimeException("comment not found"));
        if(!comments.getUserId().equals(userId)){
            throw new RuntimeException("You do not have permission to update this comment");
        }
        comments.setContent(content);
        commentsRepository.save(comments);
        return comments;
    }
}
