package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Posts,Long> {
    @Query(value = "select s" +
            " from Posts s " +
            "where s.userId= :user_id")
    List<Posts> findByUserId(@Param("user_id") Long userId);

    @Query(value = "select s" +
            " from Posts s, PostLikes a " +
            "where s.id=a.postId and a.userId=:user_id")
    List<Posts> findLikePosts(@Param("user_id")Long userId);

    @Query(value = "select s" +
            " from Posts s, PostReport a " +
            "where s.id=a.postId and a.userId=:user_id")
    List<Posts> findReportPosts(@Param("user_id")Long userId);

    @Query(value = "select s" +
            " from Posts s, PostSaves a " +
            "where s.id=a.postId and a.userId=:user_id")
    List<Posts> findSavePosts(@Param("user_id")Long userId);

}
