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
    @Query(value = "select new com.devsocial.social_media.model.vo.CommentVO(i.url,u.fullName,c.createdAt,c.content) " +
            "from Comment c " +
            "join Post p on c.postId=p.id and p.id=:postId " +
            "join UserInfo u on c.userId=u.id " +
            "left join MAIN_IMAGES i on u.imageId=i.id ")
    List<CommentVO> getAllCommentByPostId(@Param("postId")Long postId);
}
