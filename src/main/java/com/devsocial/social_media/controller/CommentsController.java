package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.entity.Comment;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.dto.CommentUpdateDTO;
import com.devsocial.social_media.service.CommentsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentsController {
    private final CommentsService commentsService;

    public CommentsController(CommentsService commentsService) {
        this.commentsService = commentsService;
    }

    @PostMapping("/create")
    SuccessResponse<Comment> createComment(@RequestBody CommentDTO commentDTO){
        return ResponseUtil.ok(
                "create comment success",
                commentsService.createComment(commentDTO)
        );
    }

    @PostMapping("/update/{id}")
    SuccessResponse<Comment> updateComment(@PathVariable Long id, @RequestBody CommentUpdateDTO commentUpdateDTO){
        return ResponseUtil.ok(
                "update comment success",
                commentsService.updateComment(id, commentUpdateDTO)
        );
    }

    @PostMapping("/delete/{id}/{userId}")
    SuccessResponse<String> deleteComment(@PathVariable Long id,@PathVariable Long userId){
        commentsService.deleteById(id,userId);
        return ResponseUtil.ok(
                "delete comment success",
                null
        );
    }

    @PostMapping("/get/{postId}")
    SuccessResponse<List<Comment>> getAllByPostId(@PathVariable Long postId) throws BusinessException {
        return ResponseUtil.ok(
                "get all comment success",
                commentsService.getAllByPostId(postId)
        );
    }
}
