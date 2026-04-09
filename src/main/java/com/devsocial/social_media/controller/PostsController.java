package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostAdminVO;
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

    @Autowired
    public PostsController(PostService postService) {
        this.postService = postService;
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
}
