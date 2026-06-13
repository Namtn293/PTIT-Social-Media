package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostDataChart;
import com.devsocial.social_media.model.vo.PostVO;
import com.devsocial.social_media.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostsController {
    private final PostService postService;
    private final com.devsocial.social_media.repository.PostsRepository postsRepository;
    private final com.devsocial.social_media.repository.PostLikesRepository postLikesRepository;
    private final com.devsocial.social_media.repository.PostSavesRepository postSavesRepository;
    private final com.devsocial.social_media.repository.PostReportRepository postReportRepository;
    private final com.devsocial.social_media.repository.UserInfoRepository userInfoRepository;

    @Autowired
    public PostsController(PostService postService,
                           com.devsocial.social_media.repository.PostsRepository postsRepository,
                           com.devsocial.social_media.repository.PostLikesRepository postLikesRepository,
                           com.devsocial.social_media.repository.PostSavesRepository postSavesRepository,
                           com.devsocial.social_media.repository.PostReportRepository postReportRepository,
                           com.devsocial.social_media.repository.UserInfoRepository userInfoRepository) {
        this.postService = postService;
        this.postsRepository = postsRepository;
        this.postLikesRepository = postLikesRepository;
        this.postSavesRepository = postSavesRepository;
        this.postReportRepository = postReportRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @GetMapping("/debug-db")
    public Object debugDb() {
        return java.util.Map.of(
            "rawPosts", postsRepository.findAll(),
            "decoratedPosts", postService.getAllPost(),
            "likes", postLikesRepository.findAll(),
            "saves", postSavesRepository.findAll(),
            "reports", postReportRepository.findAll(),
            "users", userInfoRepository.findAll(),
            "likesCountFor25", postLikesRepository.findByPostId(25L).size()
        );
    }

    @PostMapping("/create")
    public SuccessResponse<String> createPost(@Valid @RequestBody PostDTO dto){
        postService.createPost(dto);
        return ResponseUtil.ok("Create Post Success");
    }

    @DeleteMapping("/delete/{postId}")
    public SuccessResponse<String> deletePost(@PathVariable Long postId){
        postService.deletePost(postId);
        return ResponseUtil.ok("Delete Post Success");
    }

    @GetMapping("/get/all")
    public SuccessResponse<List<PostVO>> getPosts(){
        return ResponseUtil.ok("Get success",postService.getAllPost());
    }

    @GetMapping("/get-my-posts")
    public SuccessResponse<List<PostVO>> getMyPosts(){
        return ResponseUtil.ok("Get success",postService.getMyPosts());
    }

    @PostMapping("/update")
    public SuccessResponse<String> updatePost(@RequestBody PostUpdateDTO dto){
        postService.updatePost(dto);
        return ResponseUtil.ok("Update success");
    }

    @GetMapping("/get-my-like-posts")
    public SuccessResponse<List<PostVO>> getMyLikePosts(){
        return ResponseUtil.ok("Get My Like Post Success",postService.getLikePosts());
    }

    @GetMapping("/get-my-report-posts")
    public SuccessResponse<List<PostVO>> getMyReportPosts(){
        return ResponseUtil.ok("Get My Report Post Success",postService.getReportPosts());
    }

    @GetMapping("/get-my-save-posts")
    public SuccessResponse<List<PostVO>> getMySavePosts(){
        return ResponseUtil.ok("Get My Save Post Success",postService.getSavePosts());
    }

    @GetMapping("/admin/get/all")
    public SuccessResponse<List<PostAdminVO>> getAllAdminPost(){
        return ResponseUtil.ok(
                "get all post success",
                postService.getAllAdminPosts()
        );
    }

    @GetMapping("/statistic/get-post-data-chart")
    public SuccessResponse<List<PostDataChart>> getPostDateChart(){
        return ResponseUtil.ok("Get post total success", postService.getPostDataChart());
    }
}
