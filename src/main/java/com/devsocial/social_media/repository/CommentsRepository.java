package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Comment;
import com.devsocial.social_media.model.vo.CommentVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comment,Long> {
    List<Comment> findAllByPostId(Long postId);
    Optional<Comment> findById(Long id) throws RuntimeException;

    @Query("SELECT new com.devsocial.social_media.model.vo.CommentVO(" +
            "c.id, c.content, c.createdAt, c.userId, c.postId, COALESCE(u.fullName, 'Thành viên PTIT'), i.url) " +
            " FROM Comment c " +
            " LEFT JOIN User usr ON c.userId = usr.id " +
            " LEFT JOIN UserInfo u ON usr.userName = u.userName " +
            " LEFT JOIN MAIN_IMAGES i ON u.imageId = i.id " +
            " WHERE c.postId = :postId " +
            " ORDER BY c.createdAt ASC")
    List<CommentVO> findAllAsVOByPostId(@Param("postId") Long postId);
}
