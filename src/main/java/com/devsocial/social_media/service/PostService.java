package com.devsocial.social_media.service;

import com.devsocial.social_media.entity.Posts;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostVO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PostService {
    void createPost(PostDTO dto);

    void deletePost(Long postId) throws RuntimeException;

    List<PostVO> getAll(int number)throws RuntimeException;

    List<PostVO> getMyPosts();

    List<PostVO> convertToVo(List<Posts> posts) throws RuntimeException;

    void updatePost(PostUpdateDTO dto) throws RuntimeException;

    List<PostVO> getLikePosts();

    List<PostVO> getReportPosts();

    List<PostVO> getSavePosts();

    List<PostVO> getAllPosts();
}
