package com.devsocial.social_media.repository;

import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Messages,Long> {
    List<Messages> findAllByOrderByCreatedAtAsc();

}
