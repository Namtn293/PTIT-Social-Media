package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comment,Long> {
    List<Comment> findAllByPostId(Long postId);
    Optional<Comment> findById(Long id) throws RuntimeException;
}
