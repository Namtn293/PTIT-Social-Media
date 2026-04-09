package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.PostSave;
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
        PostSave postSave =postSavesRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postSave ==null){
            PostSave postSave1 =new PostSave();
            postSave1.setUserId(userId);
            postSave1.setPostId(postId);
            postSavesRepository.save(postSave1);
            return "Save Success";
        } else {
            postSavesRepository.delete(postSave);
            return "Drop the save Success";
        }
    }
}
