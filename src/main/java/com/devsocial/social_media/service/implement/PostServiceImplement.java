package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.entity.Posts;
import com.devsocial.social_media.entity.Subjects;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostVO;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.SubjectRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
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

    @Autowired
    public PostServiceImplement(PostsRepository postsRepository,ModelMapper modelMapper,SubjectRepository subjectRepository,UserInfoRepository userInfoRepository) {
        this.postsRepository = postsRepository;
        this.modelMapper = modelMapper;
        this.subjectRepository = subjectRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public void createPost(PostDTO dto){
        Posts posts=new Posts();
        posts.setTitle(dto.getTitle());
        posts.setContent(dto.getContent());
//        String userCurr= ThreadContext.getUserDetail().getUsername();
        String userCurr="";
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


}
