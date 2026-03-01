package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.PostVO;
import com.devsocial.social_media.service.PostService;
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
    public SuccessResponse<String> createPost(@RequestBody PostDTO dto){
        postService.createPost(dto);
        return ResponseUtil.ok("Create Post Success");
    }

    @PostMapping("/delete/{postId}")
    public SuccessResponse<String> deletePost(@PathVariable Long postId){
        postService.deletePost(postId);
        return ResponseUtil.ok("Delete Post Success");
    }

    @PostMapping("/get/page/{number}")
    public SuccessResponse<List<PostVO>> getPosts(@PathVariable int number) throws RuntimeException{
        return ResponseUtil.ok("Get success",postService.getAll(number));
    }

    @GetMapping("/get-my-posts")
    public SuccessResponse<List<PostVO>> getMyPosts() throws RuntimeException{
        return ResponseUtil.ok("Get success",postService.getMyPosts());
    }

    @PostMapping("/update")
    public SuccessResponse<String> updatePost(@RequestBody PostUpdateDTO dto) throws RuntimeException{
        postService.updatePost(dto);
        return ResponseUtil.ok("Update success");
    }

    @GetMapping("/get-my-like-posts")
    public SuccessResponse<List<PostVO>> getMyLikePosts(){
        return ResponseUtil.ok("Get My Like Post Success",postService.getLikePosts());
    }

    @GetMapping("/get-my-report-posts")
    public SuccessResponse<List<PostVO>> getMyReportPosts(){
        return ResponseUtil.ok("Get My Like Post Success",postService.getReportPosts());
    }

    @GetMapping("/get-my-save-posts")
    public SuccessResponse<List<PostVO>> getMySavePosts(){
        return ResponseUtil.ok("Get My Like Post Success",postService.getSavePosts());
    }
}
