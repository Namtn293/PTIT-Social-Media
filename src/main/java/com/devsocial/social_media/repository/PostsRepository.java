package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Post,Long> {
    @Query(value =" select a.id from Post a " +
            " where a.userInfoId=:userInfoId ")
    List<Long> findIdByUserInfoId(Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,'',a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " join PostReport d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getReportPostVO(@Param("userInfoId") Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,'',a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " join PostSave d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getSavePostVO(@Param("userInfoId") Long userInfoId);


    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,'',a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " join PostLike d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getLikePostVO(@Param("userInfoId") Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,'',a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where a.id =:postId")
    PostVO getPostVO(@Param("postId")Long postId);

    @Query(value = "select a.id from Post a ")
    List<Long> getAllId();


    @Query(value = "select new com.devsocial.social_media.model.vo.PostAdminVO(a.id,a.title,a.content,a.createdAt,b.userName) " +
            " from Post a " +
            " left join UserInfo b on a.userInfoId=b.id ")
    List<PostAdminVO> getAllAdminPosts();

    @Query(value = "select new com.devsocial.social_media.model.vo.PostAdminVO(a.id,a.title,a.content,a.createdAt,b.userName) " +
            " from Post a " +
            " left join UserInfo b on a.userInfoId=b.id " +
            " order by a.createdAt desc ")
    List<PostAdminVO> getRecentPosts(org.springframework.data.domain.Pageable pageable);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.likeTotal = CASE WHEN COALESCE(a.likeTotal, 0) + :valueCount < 0 THEN 0 ELSE COALESCE(a.likeTotal, 0) + :valueCount END " +
            "where a.id = :postId")
    void updateLikePostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.reportTotal = CASE WHEN COALESCE(a.reportTotal, 0) + :valueCount < 0 THEN 0 ELSE COALESCE(a.reportTotal, 0) + :valueCount END " +
            "where a.id = :postId")
    void updateReportPostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.saveTotal = CASE WHEN COALESCE(a.saveTotal, 0) + :valueCount < 0 THEN 0 ELSE COALESCE(a.saveTotal, 0) + :valueCount END " +
            "where a.id = :postId")
    void updateSavePostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.commentTotal = CASE WHEN COALESCE(a.commentTotal, 0) + :valueCount < 0 THEN 0 ELSE COALESCE(a.commentTotal, 0) + :valueCount END " +
            "where a.id = :postId")
    void updateCommentPostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @org.springframework.transaction.annotation.Transactional
    @Modifying
    @Query(value = "UPDATE MAIN_POSTS p SET " +
            "LIKE_TOTAL = (SELECT COUNT(*) FROM MAIN_POST_LIKES l WHERE l.POST_ID = p.id), " +
            "SAVE_TOTAL = (SELECT COUNT(*) FROM MAIN_POST_SAVES s WHERE s.POST_ID = p.id), " +
            "REPORT_TOTAL = (SELECT COUNT(*) FROM MAIN_POST_REPORT r WHERE r.POST_ID = p.id), " +
            "COMMENT_TOTAL = (SELECT COUNT(*) FROM MAIN_COMMENTS c WHERE c.POST_ID = p.id)", 
            nativeQuery = true)
    void syncAllPostTotals();

    @Query(value = """
        select DATE(p.created_at) as created_date,
               count(*) as total
        from main_posts p
        where p.created_at >= now() - interval '15 days'
        group by DATE(p.created_at)
        order by DATE(p.created_at)
        """, nativeQuery = true)
    List<Object[]> getPostsDataChart();


    @Query(value = """
            select count(u)
            from main_posts u
            where extract(month from u.created_at)=extract(month from now())
            and extract(year from u.created_at)=extract(year from now())
            """,nativeQuery = true)
    Long getPostTotalInThisMonth();

    @Query(value = """
            select count(u)
            from main_posts u
            where u.created_at>=date_trunc('month',current_date- interval'1 month')
            and u.created_at<date_trunc('month',current_date)
            """,nativeQuery = true)
    Long getPostTotalInLastMonth();
}
