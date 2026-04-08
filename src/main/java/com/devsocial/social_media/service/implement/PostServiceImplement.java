package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.*;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostVO;
import com.devsocial.social_media.repository.*;
import com.devsocial.social_media.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PostServiceImplement implements PostService {
    private final PostsRepository postsRepository;
    private final ModelMapper modelMapper;
    private final SubjectRepository subjectRepository;
    private final UserInfoRepository userInfoRepository;
    private final PostLikesRepository postLikesRepository;
    private final PostReportRepository postReportRepository;
    private final PostSavesRepository postSavesRepository;

    @Autowired
    public PostServiceImplement(PostSavesRepository postSavesRepository, PostReportRepository postReportRepository, PostLikesRepository postLikesRepository, PostsRepository postsRepository, ModelMapper modelMapper, SubjectRepository subjectRepository, UserInfoRepository userInfoRepository) {
        this.postsRepository = postsRepository;
        this.modelMapper = modelMapper;
        this.subjectRepository = subjectRepository;
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
        this.postReportRepository = postReportRepository;
        this.postSavesRepository = postSavesRepository;
    }

    @Override
    public void createPost(PostDTO dto) {
        Long userInfoId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElseThrow(
                ()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );
        postsRepository.save(Post.builder()
                        .title(dto.getTitle())
                        .content(dto.getContent())
                        .userInfoId(userInfoId)
                .build());
    }

    @Override
    public void deletePost(Long postId) throws RuntimeException {
        Post post = postsRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not already exist"));
        postsRepository.delete(post);

        List<PostLike> postLikes = postLikesRepository.findByPostId(postId);
        postLikes.forEach(c -> {
            postLikesRepository.delete(c);
        });

        List<PostReport> postReports = postReportRepository.findByPostId(postId);
        postReports.forEach(c -> {
            postReportRepository.delete(c);
        });

        List<PostSave> postSaves = postSavesRepository.findByPostId(postId);
        postSaves.forEach(c -> {
            postSavesRepository.delete(c);
        });
    }

    @Override
    public List<PostVO> getAllPost(){
        List<Long> postList=postsRepository.getAllId();
        return convertToVo(postList);
    }

    @Override
    public List<PostVO> getMyPosts() {
        String userName = ThreadContext.getUserDetail().getUsername();
        Long userInfoId= userInfoRepository.findIdByUserName(userName).orElseThrow(
                ()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );
        List<Long> list=postsRepository.findIdByUserInfoId(userInfoId);
        System.out.println("hello");
        return convertToVo(list);
    }

    @Override
    public void updatePost(PostUpdateDTO dto) throws RuntimeException {
        Post post = postsRepository.findById(dto.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postsRepository.save(post);
    }

    @Override
    public List<PostVO> getLikePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getLikePostVO(userInfoId);
    }

    @Override
    public List<PostVO> getReportPosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getReportPostVO(userInfoId);
    }

    @Override
    public List<PostVO> getSavePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getSavePostVO(userInfoId);
    }

    @Override
    public List<PostVO> convertToVo(List<Long> postsId){
        List<PostVO> list=new ArrayList<>();
        postsId.forEach(postId->{
            list.add(postsRepository.getPostVO(postId));
        });
        return list;
    }

    @Override
    public List<PostAdminVO> getAllAdminPosts() {
        return postsRepository.getAllAdminPosts();
    }
}
