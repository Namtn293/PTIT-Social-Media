package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.PostSave;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.repository.PostSavesRepository;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostSavesService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostSavesServiceImplement implements PostSavesService {
    private final PostSavesRepository postSavesRepository;
    private final UserInfoRepository userInfoRepository;
    private final PostsRepository postsRepository;

    public PostSavesServiceImplement(PostsRepository postsRepository, PostSavesRepository postSavesRepository, UserInfoRepository userInfoRepository) {
        this.postSavesRepository = postSavesRepository;
        this.userInfoRepository = userInfoRepository;
        this.postsRepository = postsRepository;
    }

    @Transactional
    @Override
    public String interactPost(Long postId) {
        if (!postsRepository.existsById(postId)){
            throw new BusinessException(ErrorCode.POST_NOT_EXIST);
        }
        Long userId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        PostSave postSave =postSavesRepository.findByPostIdAndUserId(postId,userId).orElse(null);

        if (postSave ==null){
            postSavesRepository.save(PostSave.builder()
                            .userId(userId)
                            .postId(postId)
                    .build());
            postsRepository.updateSavePostTotal(postId,1L);
            return "Save Success";
        } else {
            postSavesRepository.delete(postSave);
            postsRepository.updateSavePostTotal(postId,-1L);
            return "Drop the save Success";
        }
    }
}
