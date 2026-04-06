package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MajorRepository extends JpaRepository<Major,Long> {
}
