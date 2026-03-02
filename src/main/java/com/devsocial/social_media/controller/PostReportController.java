package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.service.PostReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/report")
public class PostReportController {
    private final PostReportService postReportService;

    @Autowired
    public PostReportController(PostReportService postReportService) {
        this.postReportService = postReportService;
    }

    @PostMapping("/interact/{id}")
    public SuccessResponse<String> interactPost(@PathVariable Long id){
        return ResponseUtil.ok(postReportService.interactPost(id));
    }
}
