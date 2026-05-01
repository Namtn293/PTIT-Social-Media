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

}
