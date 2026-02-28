package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.entity.Posts;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.SubjectRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PostServiceImplement implements PostService {
    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;
    private final SubjectRepository subjectRepository;
    private final UserInfoRepository userInfoRepository;

    @Autowired
    public PostServiceImplement(PostsRepository postsRepository,ModelMapper modelMapper,SubjectRepository subjectRepository,UserInfoRepository userInfoRepository) {
        this.postsRepository = postsRepository;
        this.modelMapper = modelMapper;
        this.subjectRepository = subjectRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public void createPost(PostDTO dto) throws RuntimeException {
        Posts posts=new Posts();
        posts.setTitle(dto.getTitle());
        posts.setContent(dto.getContent());
//        String userCurr= ThreadContext.getUserDetail().getUsername();
        String userCurr="";
        Long userId=userInfoRepository.findIdByUserName(userCurr).orElse(null);
        posts.setUserId(userId);

        Long subjectId=subjectRepository.findByName(dto.getSubject()).orElse(null);
        posts.setSubjectId(subjectId);

        postsRepository.save(posts);
    }
}
