package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Comment;
import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.dto.CommentUpdateDTO;
import com.devsocial.social_media.model.vo.CommentVO;
import com.devsocial.social_media.repository.CommentsRepository;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.CommentsService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class CommentsServiceImplement implements CommentsService {
    private final CommentsRepository commentsRepository;
    private final PostsRepository postsRepository;
    private final UserRepository userRepository;
    private final UserInfoRepository userInfoRepository;
    private final ImageRepository imageRepository;

    public CommentsServiceImplement(CommentsRepository commentsRepository, PostsRepository postsRepository,
                                    UserRepository userRepository, UserInfoRepository userInfoRepository,
                                    ImageRepository imageRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.imageRepository = imageRepository;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public CommentVO createComment(CommentDTO commentDTO) {
        Post post = postsRepository.findById(commentDTO.getPostId())
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        Comment comment = new Comment();
        comment.setPostId(commentDTO.getPostId());
        comment.setUserId(commentDTO.getUserId());
        comment.setContent(commentDTO.getContent());
        comment.prePersist();
        commentsRepository.save(comment);
        postsRepository.updateCommentPostTotal(commentDTO.getPostId(), 1L);

        // Build CommentVO to return to frontend immediately
        String fullName = "Thành viên PTIT";
        String avatar = null;
        if (commentDTO.getUserId() != null) {
            User user = userRepository.findById(commentDTO.getUserId()).orElse(null);
            if (user != null) {
                UserInfo userInfo = userInfoRepository.findByUserName(user.getUsername()).orElse(null);
                if (userInfo != null) {
                    if (userInfo.getFullName() != null) fullName = userInfo.getFullName();
                    if (userInfo.getImageId() != null) {
                        avatar = imageRepository.findAvatarById(userInfo.getImageId());
                    }
                }
            }
        }

        return CommentVO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .timestamp(comment.getCreatedAt())
                .userId(comment.getUserId())
                .postId(comment.getPostId())
                .fullName(fullName)
                .avatar(avatar)
                .build();
    }

    @Override
    public List<CommentVO> getAllByPostId(Long postId) throws BusinessException {
        Post post = postsRepository.findById(postId)
                .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
        List<CommentVO> comments = commentsRepository.findAllAsVOByPostId(postId);
        comments.sort(Comparator.comparing(CommentVO::getTimestamp));
        return comments;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteById(Long id, Long userId) {
        Comment comment = commentsRepository.findById(id)
                .orElseThrow(()->new BusinessException(ErrorCode.COMMENT_NOT_EXIST));

        boolean isAdmin = ThreadContext.getUserDetail().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Post post = postsRepository.findById(comment.getPostId())
                    .orElseThrow(()->new BusinessException(ErrorCode.POST_NOT_EXIST));
            
            // Check if comment owner
            boolean isCommentOwner = comment.getUserId().equals(userId);
            
            // Check if post owner
            User user = userRepository.findById(userId)
                    .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
            Long userInfoId = userInfoRepository.findIdByUserName(user.getUsername())
                    .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
            boolean isPostOwner = post.getUserInfoId().equals(userInfoId);

            if (!isCommentOwner && !isPostOwner) {
                throw new BusinessException(ErrorCode.FORBIDDEN);
            }
        }

        commentsRepository.delete(comment);
        commentsRepository.flush();
        postsRepository.updateCommentPostTotal(comment.getPostId(), -1L);
    }

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
