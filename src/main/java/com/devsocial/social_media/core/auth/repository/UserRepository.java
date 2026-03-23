package com.devsocial.social_media.core.auth.repository;

import com.devsocial.social_media.core.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUserName(String userName);

    Optional<User> findByUserName(String userName);
}
