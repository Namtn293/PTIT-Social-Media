package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.PostReport;
import com.devsocial.social_media.entity.PostSaves;
import com.devsocial.social_media.repository.PostSavesRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostSavesService;
import org.springframework.stereotype.Service;

@Service
public class PostSavesServiceImplement implements PostSavesService {
    private final PostSavesRepository postSavesRepository;
    private final UserInfoRepository userInfoRepository;

    public PostSavesServiceImplement(PostSavesRepository postSavesRepository, UserInfoRepository userInfoRepository) {
        this.postSavesRepository = postSavesRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public String interactPost(Long postId) {
        Long userId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        PostSaves postSaves=postSavesRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postSaves==null){
            PostSaves postSaves1=new PostSaves();
            postSaves1.setUserId(userId);
            postSaves1.setPostId(postId);
            postSavesRepository.save(postSaves1);
            return "Save Success";
        } else {
            postSavesRepository.delete(postSaves);
            return "Drop the save Success";
        }
    }
}
