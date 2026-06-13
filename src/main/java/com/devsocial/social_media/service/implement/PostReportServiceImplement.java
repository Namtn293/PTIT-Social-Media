package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.PostReport;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.repository.PostReportRepository;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostReportServiceImplement implements PostReportService {
    private final UserInfoRepository userInfoRepository;
    private final PostReportRepository postReportRepository;
    private final PostsRepository postsRepository;

    @Autowired
    public PostReportServiceImplement(PostsRepository postsRepository,UserInfoRepository userInfoRepository, PostReportRepository postReportRepository) {
        this.userInfoRepository = userInfoRepository;
        this.postReportRepository = postReportRepository;
        this.postsRepository = postsRepository;
    }

    @Transactional
    @Override
    public String interactPost(Long postId) {
        if (!postsRepository.existsById(postId)){
            throw new BusinessException(ErrorCode.POST_NOT_EXIST);
        }

        Long userId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername())
                .orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST));
        PostReport postReport=postReportRepository.findByPostIdAndUserId(postId,userId).orElse(null);

        if (postReport == null){
            postReportRepository.save(PostReport.builder()
                            .userId(userId)
                            .postId(postId)
                    .build());
            postReportRepository.flush();
            postsRepository.updateReportPostTotal(postId,1L);
            return "Report Success";
        } else {
            postReportRepository.delete(postReport);
            postReportRepository.flush();
            postsRepository.updateReportPostTotal(postId,-1L);
            return "Drop the report Success";
        }
    }
}
