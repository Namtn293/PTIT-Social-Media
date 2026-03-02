package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.PostReport;
import com.devsocial.social_media.repository.PostReportRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostReportServiceImplement implements PostReportService {
    private final UserInfoRepository userInfoRepository;
    private final PostReportRepository postReportRepository;

    @Autowired
    public PostReportServiceImplement(UserInfoRepository userInfoRepository, PostReportRepository postReportRepository) {
        this.userInfoRepository = userInfoRepository;
        this.postReportRepository = postReportRepository;
    }

    @Override
    public String interactPost(Long postId) {
        Long userId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        PostReport postReport=postReportRepository.findByPostIdAndUserId(postId,userId).orElse(null);
        if (postReport==null){
            PostReport postReport1=new PostReport();
            postReport1.setUserId(userId);
            postReport1.setPostId(postId);
            postReportRepository.save(postReport1);
            return "Report Success";
        } else {
            postReportRepository.delete(postReport);
            return "Drop the report Success";
        }
    }
}
