package com.devsocial.social_media.repository;

import com.devsocial.social_media.entity.Message;
import com.devsocial.social_media.model.vo.MessageVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
    @Query("SELECT new com.devsocial.social_media.model.vo.MessageVO(" +
            "i.url, m.createdAt, COALESCE(u.fullName, 'Thành viên PTIT'), m.content, m.userId, u.userName) " +
            " FROM Message m " +
            " LEFT JOIN UserInfo u ON m.userId = u.id " +
            " LEFT JOIN MAIN_IMAGES i ON u.imageId = i.id " +
            " ORDER BY m.createdAt ASC")
    List<MessageVO> findAllAsVO();

}