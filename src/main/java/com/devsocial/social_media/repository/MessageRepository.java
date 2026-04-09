package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
    List<Message> findAllByOrderByCreatedAtAsc();

}
