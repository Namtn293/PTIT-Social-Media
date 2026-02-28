package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo,Long> {

    @Query(value = "select s.id " +
            "from UserInfo s " +
            "where s.userName= :user_name", nativeQuery = false)
    Optional<Long> findByUserName(@Param("user_name") String userName);
}
