package com.devsocial.social_media.service;

public interface PostLikesService {
    void interactPost(Long postId) throws RuntimeException;
}
