package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long> {

    Optional<Image> findByUrl(String url);
    Optional<Image> findById(Long id);

    @Query("SELECT a.url FROM MAIN_IMAGES a WHERE a.id = :imageId")
    String findAvatarById(@Param("imageId") Long id);
}