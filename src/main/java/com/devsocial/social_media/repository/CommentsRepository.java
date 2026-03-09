package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comments,Long> {
    List<Comments> findAllByPostId(Long postId);
    Optional<Comments> findById(Long id) throws RuntimeException;
}
