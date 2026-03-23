package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Files;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FilesRepository extends JpaRepository<Files,Long> {
    Optional<Files> findById(Long id);
}
