package com.devsocial.social_media.service;

import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.AdminDashboardStatsVO;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostDataChart;
import com.devsocial.social_media.model.vo.PostVO;

import java.util.List;

public interface PostService {
    void createPost(PostDTO dto);

    void deletePost(Long postId) ;

    List<PostVO> getAllPost();

    List<PostVO> getMyPosts();

    List<PostVO> convertToVo(List<Long> postsId);

    void updatePost(PostUpdateDTO dto);

    List<PostVO> getLikePosts();

    List<PostVO> getReportPosts();

    List<PostVO> getSavePosts();

    List<PostAdminVO> getAllAdminPosts();

    List<PostDataChart> getPostDataChart();

    List<PostAdminVO> getRecentPosts();

    AdminDashboardStatsVO getAdminDashboardStats();
}
