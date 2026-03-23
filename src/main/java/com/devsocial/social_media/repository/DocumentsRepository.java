package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentsRepository extends JpaRepository<Documents,Long> {
    Optional<Documents> findById(Long id);

    @Query(value = "SELECT DISTINCT f.url"
            + " FROM main_documents d"
            + " JOIN main_files f"
            + " ON d.file_id = f.id"
            + " WHERE d.file_id = :fileId",
            nativeQuery = true
    )
    List<String> getFileURL(@Param("fileId") Long fileId);

    @Query(value = "SELECT DISTINCT i.url"
            + " FROM main_documents d"
            + " JOIN main_images i"
            + " ON d.image_id = i.id"
            + " WHERE d.image_id = :imageId",
            nativeQuery = true
    )
    List<String> getImageURL(@Param("imageId") Long imageId);
}
