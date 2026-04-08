package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLike,Long> {
    @Query(value = "select s " +
            "from PostLike s " +
            "where s.postId=:post_id and s.userId=:user_id")
    Optional<PostLike> findByPostIdAndUserId(@Param("post_id")Long postId, @Param("user_id")Long userId);


    @Query(value = "select s " +
            "from PostLike s " +
            "where s.postId=:post_id")
    List<PostLike> findByPostId(@Param("post_id")Long postId);

}
