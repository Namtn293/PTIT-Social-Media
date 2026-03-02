package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.service.PostSavesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/save")
public class PostSavesController {
    private final PostSavesService postSavesService;

    @Autowired
    public PostSavesController(PostSavesService postSavesService) {
        this.postSavesService = postSavesService;
    }

    @PostMapping("/interact/{id}")
    public SuccessResponse<String> interactPost(@PathVariable Long id){
        return ResponseUtil.ok(postSavesService.interactPost(id));
    }
}
