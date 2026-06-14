package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo,Long> {

    @Query(value = "select s.id " +
            "from UserInfo s " +
            "where s.userName= :user_name", nativeQuery = false)
    Optional<Long> findIdByUserName(@Param("user_name") String userName);

    List<UserInfo> findAll();
    Optional<UserInfo> findByUserName(String userName);

    @Query(value = "select s.userName " +
            "from UserInfo s " +
            "where s.id= :id", nativeQuery = false)
    Optional<String> findUserNameById(@Param("id") Long id);

    boolean existsByEmail(String email);
}
