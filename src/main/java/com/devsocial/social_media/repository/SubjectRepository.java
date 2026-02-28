package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Subjects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subjects,Long> {
    @Query(value = "select s.id " +
            "from Subjects s " +
            "where s.subjectName= :subject_name",nativeQuery = false)
    Optional<Long> findIdByName(@Param("subject_name") String subject);

    @Query(value = "select s " +
            "from Subjects s " +
            "where s.subjectName= :subject_name",nativeQuery = false)
    Optional<Long> findByName(@Param("subject_name") String subject);
}
