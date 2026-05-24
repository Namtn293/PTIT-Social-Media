package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Post;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PostsRepository extends JpaRepository<Post,Long> {
    @Query(value =" select a.id from Post a " +
            " where a.userInfoId=:userInfoId ")
    List<Long> findIdByUserInfoId(Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,c.className,a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " left join Classes c on b.classId=c.id " +
            " join PostReport d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getReportPostVO(@Param("userInfoId") Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,c.className,a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " left join Classes c on b.classId=c.id " +
            " join PostSave d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getSavePostVO(@Param("userInfoId") Long userInfoId);


    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,c.className,a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " left join Classes c on b.classId=c.id " +
            " join PostLike d on d.postId=a.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where d.userId= :userInfoId ")
    List<PostVO> getLikePostVO(@Param("userInfoId") Long userInfoId);

    @Query(value = "select new com.devsocial.social_media.model.vo.PostVO(a.title,a.content,a.createdAt,b.fullName,c.className,a.likeTotal,a.commentTotal,a.saveTotal,a.reportTotal,a.id,b.userName,e.url)" +
            " from Post a " +
            " left join UserInfo b on b.id=a.userInfoId " +
            " left join Classes c on b.classId=c.id " +
            " left join MAIN_IMAGES e on e.id=b.imageId" +
            " where a.id =:postId")
    PostVO getPostVO(@Param("postId")Long postId);

    @Query(value = "select a.id from Post a ")
    List<Long> getAllId();


    @Query(value = "select new com.devsocial.social_media.model.vo.PostAdminVO(a.id,a.title,a.content,a.createdAt,b.userName) " +
            " from Post a " +
            " left join UserInfo b on a.userInfoId=b.id ")
    List<PostAdminVO> getAllAdminPosts();

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.likeTotal=a.likeTotal+ :valueCount " +
            "where a.id=:postId")
    void updateLikePostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.reportTotal=a.reportTotal+ :valueCount " +
            "where a.id=:postId")
    void updateReportPostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

    @Modifying(clearAutomatically = true)
    @Query(value = "update Post a " +
            "set a.saveTotal=a.saveTotal+ :valueCount " +
            "where a.id=:postId")
    void updateSavePostTotal(@Param("postId")Long postId, @Param("valueCount") Long valueCount);

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

    @Query(value = "select new com.devsocial.social_media.model.vo.PostAdminVO(p.id,p.title,p.content,p.createdAt,u.fullName) " +
            "from Post p " +
            "join UserInfo u on u.id=p.userInfoId " +
            "order by p.createdAt desc " +
            "limit 4 ")
    List<PostAdminVO> getTop4EarlyPost();

    @Transactional
    @Modifying
    @Query(value = "update Post " +
            "set commentTotal=commentTotal+1 where id=:postId")
    void updateCommentTotal(@Param("postId")Long postId);
}
