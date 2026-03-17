package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Images,Long> {
//    @Query(value = "Select url from Images where url = :url")
//    String findPublicIdByUrl(@Param("url") String url);

    Optional<Images> findByUrl(String url);
    Optional<Images> findById(Long id);
}