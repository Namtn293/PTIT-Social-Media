package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.PostSaves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostSavesRepository extends JpaRepository<PostSaves,Long> {
    @Query(value = "select s " +
            "from PostSaves s " +
            "where s.postId=:post_id and s.userId=:user_id")
    Optional<PostSaves> findByPostIdAndUserId(@Param("post_id")Long postId, @Param("user_id")Long userId);



    @Query(value = "select s " +
            "from PostSaves s " +
            "where s.postId=:post_id")
    List<PostSaves> findByPostId(@Param("post_id")Long postId);

}
