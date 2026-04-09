package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.PostSave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostSavesRepository extends JpaRepository<PostSave,Long> {
    @Query(value = "select s " +
            "from PostSave s " +
            "where s.postId=:post_id and s.userId=:user_id")
    Optional<PostSave> findByPostIdAndUserId(@Param("post_id")Long postId, @Param("user_id")Long userId);



    @Query(value = "select s " +
            "from PostSave s " +
            "where s.postId=:post_id")
    List<PostSave> findByPostId(@Param("post_id")Long postId);

}
