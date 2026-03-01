package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.PostLikes;
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
    public void interactPost(Long postId) throws RuntimeException {
        Long userId=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        PostLikes postLikes=postLikesRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postLikes==null){
            PostLikes postLikes1=new PostLikes();
            postLikes1.setPostId(postId);
            postLikes1.setUserId(userId);
            postLikesRepository.save(postLikes1);
        }else{
            postLikesRepository.delete(postLikes);
        }
    }
}
