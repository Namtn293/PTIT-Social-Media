package com.devsocial.social_media.core.auth.repository;

import com.devsocial.social_media.core.auth.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token,Long> {
    List<Token> findByUserId(Long userId);

    Optional<Token> findByToken(String token);
}
