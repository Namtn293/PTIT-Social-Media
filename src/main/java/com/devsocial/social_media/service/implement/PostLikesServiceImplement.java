package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.PostLike;
import com.devsocial.social_media.repository.PostLikesRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostLikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostLikesServiceImplement implements PostLikesService {
    private final UserInfoRepository userInfoRepository;
    private final PostLikesRepository postLikesRepository;

    @Autowired
    public PostLikesServiceImplement(UserInfoRepository userInfoRepository, PostLikesRepository postLikesRepository) {
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
    }

    @Override
    public String interactPost(Long postId) throws RuntimeException {
        Long userId=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        PostLike postLike =postLikesRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postLike ==null){
            PostLike postLike1 =new PostLike();
            postLike1.setPostId(postId);
            postLike1.setUserId(userId);
            postLikesRepository.save(postLike1);
            return "Like Success";
        }else{
            postLikesRepository.delete(postLike);
            return "Dislike Success";
        }
    }
}
