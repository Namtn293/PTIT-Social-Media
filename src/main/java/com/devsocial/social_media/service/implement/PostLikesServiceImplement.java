package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.PostLike;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.repository.PostLikesRepository;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostLikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostLikesServiceImplement implements PostLikesService {
    private final UserInfoRepository userInfoRepository;
    private final PostLikesRepository postLikesRepository;
    private final PostsRepository postsRepository;

    @Autowired
    public PostLikesServiceImplement(PostsRepository postsRepository,UserInfoRepository userInfoRepository, PostLikesRepository postLikesRepository) {
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
        this.postsRepository = postsRepository;
    }

    @Override
    @Transactional
    public String interactPost(Long postId){
        if (!postsRepository.existsById(postId)){
            throw new BusinessException(ErrorCode.POST_NOT_EXIST);
        }

        Long userId=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername())
                .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
        PostLike postLike = postLikesRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postLike == null){
            postLikesRepository.save(PostLike.builder()
                            .postId(postId)
                            .userId(userId)
                    .build());
            postLikesRepository.flush();
            postsRepository.updateLikePostTotal(postId,1L);
            return "Like Success";
        } else {
            postLikesRepository.delete(postLike);
            postLikesRepository.flush();
            postsRepository.updateLikePostTotal(postId,-1L);
            return "Dislike Success";
        }
    }
}
