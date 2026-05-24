package com.devsocial.social_media.core.auth.repository;

import com.devsocial.social_media.core.auth.entity.User;
import com.devsocial.social_media.enumration.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUserName(String userName);

    Optional<User> findByUserName(String userName);

    @Query(value = "select a.roleEnum from User a " +
            "where a.userName= :userInfoName")
    RoleEnum findRoleEnumByUserName(@Param(value = "userInfoName") String userName);

    void deleteUserByUserName(String userName);

    @Query(value = """
            select count(u)
            from auth_user u
            where extract(month from u.created_at)=extract(month from now())
            and extract(year from u.created_at)=extract(year from now())
            """,nativeQuery = true)
    Long getUserTotalInThisMonth();

    @Query(value = """
            select count(u)
            from auth_user u
            where u.created_at>=date_trunc('month',current_date- interval'1 month')
            and u.created_at<date_trunc('month',current_date)
            """,nativeQuery = true)
    Long getUserTotalInLastMonth();
}
