package com.devsocial.social_media;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.entity.*;
import com.devsocial.social_media.model.dto.CommentDTO;
import com.devsocial.social_media.model.vo.CommentVO;
import com.devsocial.social_media.repository.PostsRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.repository.CommentsRepository;
import com.devsocial.social_media.service.PostLikesService;
import com.devsocial.social_media.service.PostSavesService;
import com.devsocial.social_media.service.PostReportService;
import com.devsocial.social_media.service.CommentsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SocialMediaApplicationTests {

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private PostLikesService postLikesService;

    @Autowired
    private PostSavesService postSavesService;

    @Autowired
    private PostReportService postReportService;

    @Autowired
    private CommentsService commentsService;

    private UserInfo testUser;
    private Post testPost;

    @BeforeEach
    void setUp() {
        // Find or create test user
        testUser = userInfoRepository.findAll().stream().findFirst().orElseGet(() -> {
            UserInfo newUser = new UserInfo();
            newUser.setUserName("test_user_unique");
            newUser.setFullName("Test User Unique");
            newUser.setEmail("testunique@ptit.edu.vn");
            return userInfoRepository.save(newUser);
        });

        // Setup spring security context for test
        UserDetails userDetails = new User(testUser.getUserName(), "password", Collections.emptyList());
        ThreadContext.setUserDetail(userDetails);

        // Create test post
        testPost = new Post();
        testPost.setTitle("Test Title");
        testPost.setContent("Test Content");
        testPost.setUserInfoId(testUser.getId());
        testPost.prePersist();
        testPost = postsRepository.save(testPost);
    }

    @AfterEach
    void tearDown() {
        if (testPost != null && testPost.getId() != null) {
            try {
                // Delete any comments, likes, saves, reports created during test if they exist
                postsRepository.deleteById(testPost.getId());
            } catch (Exception ignored) {
            }
        }
        ThreadContext.setUserDetail(null);
    }

    @Test
    void testLikeAndUnlikeUpdatesPostLikeTotal() {
        Long postId = testPost.getId();

        // Check initial state
        Post postBefore = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postBefore.getLikeTotal(), "Initial like total should be 0");

        // 1. Perform LIKE
        String likeRes = postLikesService.interactPost(postId);
        assertEquals("Like Success", likeRes);

        Post postAfterLike = postsRepository.findById(postId).orElseThrow();
        assertEquals(1L, postAfterLike.getLikeTotal(), "Like total should increment to 1");

        // 2. Perform UNLIKE (Dislike)
        String unlikeRes = postLikesService.interactPost(postId);
        assertEquals("Dislike Success", unlikeRes);

        Post postAfterUnlike = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postAfterUnlike.getLikeTotal(), "Like total should decrement back to 0");
    }

    @Test
    void testSaveAndUnsaveUpdatesPostSaveTotal() {
        Long postId = testPost.getId();

        // Check initial state
        Post postBefore = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postBefore.getSaveTotal(), "Initial save total should be 0");

        // 1. Perform SAVE
        String saveRes = postSavesService.interactPost(postId);
        assertEquals("Save Success", saveRes);

        Post postAfterSave = postsRepository.findById(postId).orElseThrow();
        assertEquals(1L, postAfterSave.getSaveTotal(), "Save total should increment to 1");

        // 2. Perform UNSAVE (Drop the save)
        String unsaveRes = postSavesService.interactPost(postId);
        assertEquals("Drop the save Success", unsaveRes);

        Post postAfterUnsave = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postAfterUnsave.getSaveTotal(), "Save total should decrement back to 0");
    }

    @Test
    void testReportAndUnreportUpdatesPostReportTotal() {
        Long postId = testPost.getId();

        // Check initial state
        Post postBefore = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postBefore.getReportTotal(), "Initial report total should be 0");

        // 1. Perform REPORT
        String reportRes = postReportService.interactPost(postId);
        assertEquals("Report Success", reportRes);

        Post postAfterReport = postsRepository.findById(postId).orElseThrow();
        assertEquals(1L, postAfterReport.getReportTotal(), "Report total should increment to 1");

        // 2. Perform UNREPORT (Drop the report)
        String unreportRes = postReportService.interactPost(postId);
        assertEquals("Drop the report Success", unreportRes);

        Post postAfterUnreport = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postAfterUnreport.getReportTotal(), "Report total should decrement back to 0");
    }

    @Test
    void testCommentCreateAndDeleteUpdatesPostCommentTotal() {
        Long postId = testPost.getId();

        // Check initial state
        Post postBefore = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postBefore.getCommentTotal(), "Initial comment total should be 0");

        // 1. Create Comment
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setPostId(postId);
        commentDTO.setUserId(testUser.getId());
        commentDTO.setContent("Test Comment Content");

        CommentVO comment = commentsService.createComment(commentDTO);
        assertNotNull(comment);
        assertNotNull(comment.getId());

        Post postAfterComment = postsRepository.findById(postId).orElseThrow();
        assertEquals(1L, postAfterComment.getCommentTotal(), "Comment total should increment to 1");

        // 2. Delete Comment
        commentsService.deleteById(comment.getId(), testUser.getId());

        Post postAfterDelete = postsRepository.findById(postId).orElseThrow();
        assertEquals(0L, postAfterDelete.getCommentTotal(), "Comment total should decrement back to 0");
    }

    @Autowired
    private com.devsocial.social_media.service.NotificationService notificationService;

    @Autowired
    private com.devsocial.social_media.repository.UserNotificationRepository userNotificationRepository;

    @Autowired
    private com.devsocial.social_media.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.devsocial.social_media.core.auth.repository.UserRepository userRepository;

    @Test
    @Transactional
    void testNotificationLifecycle() {
        // Setup a real User entity for testing (matching testUser username)
        com.devsocial.social_media.core.auth.entity.User authUser = userRepository.findByUserName(testUser.getUserName()).orElseGet(() -> {
            com.devsocial.social_media.core.auth.entity.User u = new com.devsocial.social_media.core.auth.entity.User();
            u.setUserName(testUser.getUserName());
            u.setRoleEnum(com.devsocial.social_media.enumration.RoleEnum.STUDENT);
            u.setPassword("password");
            return userRepository.save(u);
        });

        // 1. Create a notification for specific user
        com.devsocial.social_media.model.dto.NotificationCreateDTO createDTO = new com.devsocial.social_media.model.dto.NotificationCreateDTO();
        createDTO.setTitle("Test Announcement");
        createDTO.setContent("Test Message Body");
        createDTO.setUserName(testUser.getUserName());

        notificationService.createNotification(createDTO);

        // 2. Retrieve My Notifications
        var myNotifs = notificationService.getMyNotifications();
        assertFalse(myNotifs.isEmpty(), "User should have at least one notification");
        assertEquals("Test Announcement", myNotifs.get(0).getTitle());
        assertEquals("Test Message Body", myNotifs.get(0).getContent());
        assertFalse(myNotifs.get(0).getIsRead());

        // 3. Retrieve All Notifications for Admin
        var allNotifs = notificationService.getAllNotifications();
        assertFalse(allNotifs.isEmpty(), "Admin should be able to retrieve all notifications");
        assertTrue(allNotifs.stream().anyMatch(n -> n.getUserName().equals(testUser.getUserName())));

        // 4. Delete the notification
        Long userNotifId = myNotifs.get(0).getId();
        notificationService.deleteNotification(userNotifId);

        var myNotifsAfterDelete = notificationService.getMyNotifications();
        assertTrue(myNotifsAfterDelete.stream().noneMatch(n -> n.getId().equals(userNotifId)), "Deleted notification should not be returned");
    }
}
