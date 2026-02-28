package com.devsocial.social_media.service;

import com.devsocial.social_media.model.dto.PostDTO;

public interface PostService {
    void createPost(PostDTO dto) throws RuntimeException;
}
