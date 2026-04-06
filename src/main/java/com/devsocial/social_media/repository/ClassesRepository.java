package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassesRepository extends JpaRepository<Classes,Long> {
}
