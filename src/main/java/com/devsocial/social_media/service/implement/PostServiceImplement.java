package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.*;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
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
    public PostServiceImplement(PostSavesRepository postSavesRepository,PostReportRepository postReportRepository,PostLikesRepository postLikesRepository,PostsRepository postsRepository,ModelMapper modelMapper,SubjectRepository subjectRepository,UserInfoRepository userInfoRepository) {
        this.postsRepository = postsRepository;
        this.modelMapper = modelMapper;
        this.subjectRepository = subjectRepository;
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
        this.postReportRepository = postReportRepository;
        this.postSavesRepository = postSavesRepository;
    }

    @Override
    public void createPost(PostDTO dto){
        Posts posts=new Posts();
        posts.setTitle(dto.getTitle());
        posts.setContent(dto.getContent());
        String userCurr= ThreadContext.getUserDetail().getUsername();
        Long userId=userInfoRepository.findIdByUserName(userCurr).orElse(null);
        posts.setUserId(userId);

        Long subjectId=subjectRepository.findIdByName(dto.getSubject()).orElse(null);
        posts.setSubjectId(subjectId);

        postsRepository.save(posts);
    }

    @Override
    public void deletePost(Long postId) throws RuntimeException{
        Posts post=postsRepository.findById(postId).orElseThrow(()->new RuntimeException("Post not already exist"));
        postsRepository.delete(post);

        List<PostLikes> postLikes=postLikesRepository.findByPostId(postId);
        postLikes.forEach(c->{
            postLikesRepository.delete(c);
        });

        List<PostReport> postReports=postReportRepository.findByPostId(postId);
        postReports.forEach(c->{
            postReportRepository.delete(c);
        });

        List<PostSaves> postSaves=postSavesRepository.findByPostId(postId);
        postSaves.forEach(c->{
            postSavesRepository.delete(c);
        });
    }

    @Override
    public List<PostVO> getAll(int number) throws RuntimeException{
        Pageable pageable= PageRequest.of(number,10);
        Page<Posts> posts=postsRepository.findAll(pageable);
        List<Posts> postsList=posts.getContent().stream().toList();
        return convertToVo(postsList);
    }

    @Override
    public List<PostVO> getMyPosts() {
        String userName= ThreadContext.getUserDetail().getUsername();
        List<Posts> list=postsRepository.findByUserId(userInfoRepository.findIdByUserName(userName).orElse(null));
        return convertToVo(list);
    }

    @Override
    public List<PostVO> convertToVo(List<Posts> posts) throws RuntimeException {
        List<PostVO> list=new ArrayList<>();
        for (Posts p:posts){
            Subjects subject=subjectRepository.findById(p.getSubjectId()).orElseThrow(()->new RuntimeException("Subject not found"));
            String userName=userInfoRepository.findUserNameById(p.getUserId()).orElseThrow(()->new RuntimeException("User not found"));
            PostVO vo=new PostVO();
            vo.setAuthor(userName);
            vo.setSubject(subject.getSubjectName());
            vo.setContent(p.getContent());
            vo.setCreateAt(p.getCreatedAt());
            vo.setTitle(p.getTitle());
            list.add(vo);
        }
        return list;
    }

    @Override
    public void updatePost(PostUpdateDTO dto) throws RuntimeException {
        Posts post=postsRepository.findById(dto.getPostId()).orElseThrow(()->new RuntimeException("Post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postsRepository.save(post);
    }

    @Override
    public List<PostVO> getLikePosts() {
        Long id=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        List<Posts> list=postsRepository.findLikePosts(id);
        return convertToVo(list);
    }

    @Override
    public List<PostVO> getReportPosts() {
        Long id=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        List<Posts> list=postsRepository.findReportPosts(id);
        return convertToVo(list);
    }

    @Override
    public List<PostVO> getSavePosts() {
        Long id=userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        List<Posts> list=postsRepository.findSavePosts(id);
        return convertToVo(list);
    }

    @Override
    public List<PostVO> getAllPosts() {
        return convertToVo(postsRepository.findAll());
    }
}
