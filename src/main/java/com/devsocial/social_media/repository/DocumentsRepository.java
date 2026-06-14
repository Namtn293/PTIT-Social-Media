package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentsRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    List<Document> findByCreateBy(String createBy);

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


    @Query(value = """
            select count(u)
            from main_documents u
            where extract(month from u.created_at)=extract(month from now())
            and extract(year from u.created_at)=extract(year from now())
            """,nativeQuery = true)
    Long getDocumentTotalInThisMonth();

    @Query(value = """
            select count(u)
            from main_documents u
            where u.created_at>=date_trunc('month',current_date- interval'1 month')
            and u.created_at<date_trunc('month',current_date)
            """,nativeQuery = true)
    Long getDocumentTotalInLastMonth();
}
