package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.auth.repository.UserRepository;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.*;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.AdminDashboardStatsVO;
import com.devsocial.social_media.model.vo.PostAdminVO;
import com.devsocial.social_media.model.vo.PostDataChart;
import com.devsocial.social_media.model.vo.PostVO;
import com.devsocial.social_media.repository.*;
import com.devsocial.social_media.service.PostService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class PostServiceImplement implements PostService {
    private final PostsRepository postsRepository;
    private final UserInfoRepository userInfoRepository;
    private final PostLikesRepository postLikesRepository;
    private final PostReportRepository postReportRepository;
    private final PostSavesRepository postSavesRepository;
    private final CommentsRepository commentsRepository;
    private final DocumentsRepository documentsRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public PostServiceImplement(PostSavesRepository postSavesRepository, PostReportRepository postReportRepository, PostLikesRepository postLikesRepository, PostsRepository postsRepository, UserInfoRepository userInfoRepository, CommentsRepository commentsRepository, DocumentsRepository documentsRepository, NotificationRepository notificationRepository) {
        this.postsRepository = postsRepository;
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
        this.postReportRepository = postReportRepository;
        this.postSavesRepository = postSavesRepository;
        this.commentsRepository = commentsRepository;
        this.documentsRepository = documentsRepository;
        this.notificationRepository = notificationRepository;
    }

    @jakarta.annotation.PostConstruct
    @Transactional
    public void init() {
        try {
            postsRepository.syncAllPostTotals();
            log.info("Successfully synchronized all post totals with database records.");
        } catch (Exception e) {
            log.error("Failed to synchronize post totals: ", e);
        }
    }

    @Override
    public void createPost(@Valid PostDTO dto) {
        Long userInfoId= userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElseThrow(
                ()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );
        postsRepository.save(Post.builder()
                        .title(dto.getTitle())
                        .content(dto.getContent())
                        .userInfoId(userInfoId)
                .build());
    }

    @Override
    @Transactional
    public void deletePost(Long postId) throws RuntimeException {
        Post post = postsRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_EXIST));

        String userName = ThreadContext.getUserDetail().getUsername();
        Long currentUserId = userInfoRepository.findIdByUserName(userName).orElseThrow(
                () -> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );

        boolean isAdmin = ThreadContext.getUserDetail().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !post.getUserInfoId().equals(currentUserId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        List<Comment> comments = commentsRepository.findAllByPostId(postId);
        if (!comments.isEmpty()) {
            commentsRepository.deleteAllInBatch(comments);
        }

        List<PostLike> postLikes = postLikesRepository.findByPostId(postId);
        if (!postLikes.isEmpty()) {
            postLikesRepository.deleteAllInBatch(postLikes);
        }

        List<PostReport> postReports = postReportRepository.findByPostId(postId);
        if (!postReports.isEmpty()) {
            postReportRepository.deleteAllInBatch(postReports);
        }

        List<PostSave> postSaves = postSavesRepository.findByPostId(postId);
        if (!postSaves.isEmpty()) {
            postSavesRepository.deleteAllInBatch(postSaves);
        }

        postsRepository.delete(post);
    }

    private List<PostVO> decoratePostVOList(List<PostVO> list) {
        if (list == null || list.isEmpty()) {
            return list;
        }
        Long currentUserId = null;
        try {
            String currentUsername = ThreadContext.getUserDetail().getUsername();
            if (currentUsername != null) {
                currentUserId = userInfoRepository.findIdByUserName(currentUsername).orElse(null);
            }
        } catch (Exception ignored) {}

        if (currentUserId == null) {
            return list;
        }

        final Long finalUserId = currentUserId;
        list.forEach(vo -> {
            if (vo != null && vo.getId() != null) {
                vo.setLiked(postLikesRepository.findByPostIdAndUserId(vo.getId(), finalUserId).isPresent());
                vo.setSaved(postSavesRepository.findByPostIdAndUserId(vo.getId(), finalUserId).isPresent());
                vo.setReported(postReportRepository.findByPostIdAndUserId(vo.getId(), finalUserId).isPresent());
            }
        });
        return list;
    }

    @Override
    public List<PostVO> getAllPost(){
        List<Long> postList=postsRepository.getAllId();
        return decoratePostVOList(convertToVo(postList));
    }

    @Override
    public List<PostVO> getMyPosts() {
        String userName = ThreadContext.getUserDetail().getUsername();
        Long userInfoId= userInfoRepository.findIdByUserName(userName).orElseThrow(
                ()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );
        List<Long> list=postsRepository.findIdByUserInfoId(userInfoId);
        System.out.println("hello");
        return decoratePostVOList(convertToVo(list));
    }

    @Override
    public void updatePost(PostUpdateDTO dto) throws RuntimeException {
        Post post = postsRepository.findById(dto.getPostId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_EXIST));

        String userName = ThreadContext.getUserDetail().getUsername();
        Long currentUserId = userInfoRepository.findIdByUserName(userName).orElseThrow(
                () -> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );

        boolean isAdmin = ThreadContext.getUserDetail().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !post.getUserInfoId().equals(currentUserId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postsRepository.save(post);
    }

    @Override
    public List<PostVO> getLikePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return decoratePostVOList(postsRepository.getLikePostVO(userInfoId));
    }

    @Override
    public List<PostVO> getReportPosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return decoratePostVOList(postsRepository.getReportPostVO(userInfoId));
    }

    @Override
    public List<PostVO> getSavePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return decoratePostVOList(postsRepository.getSavePostVO(userInfoId));
    }

    @Override
    public List<PostVO> convertToVo(List<Long> postsId){
        List<PostVO> list=new ArrayList<>();
        postsId.forEach(postId->{
            list.add(postsRepository.getPostVO(postId));
        });
        return list;
    }

    @Override
    public List<PostAdminVO> getAllAdminPosts() {
        return postsRepository.getAllAdminPosts();
    }

    @Override
    public List<PostDataChart> getPostDataChart() {
        Map<LocalDate,Long> map=new TreeMap<>();
        for (LocalDate localDate = LocalDate.now().minusDays(14);!localDate.isAfter(LocalDate.now());localDate = localDate.plusDays(1)) {
            map.put(localDate, 0L);
        }

        List<Object[]> results=postsRepository.getPostsDataChart();
        for (Object[] o:results){
            LocalDate date=((LocalDate) o[0]);
            Long posts=((Number) o[1]).longValue();
            if (map.containsKey(date)){
                map.put(date,posts);
            }
            System.out.println(date+" "+posts);
        }
        List<PostDataChart> postDataChartList=new ArrayList<>();
        map.forEach((key,value)->{
            String date=key.format(DateTimeFormatter.ofPattern("dd/MM"));
            postDataChartList.add(PostDataChart.builder()
                            .date(date)
                            .posts(value)
                    .build());
        });
        return postDataChartList;
    }

    @Override
    public List<PostAdminVO> getRecentPosts() {
        return postsRepository.getRecentPosts(PageRequest.of(0, 4));
    }

    @Override
    public AdminDashboardStatsVO getAdminDashboardStats() {
        long usersCount = userInfoRepository.count();
        long postsCount = postsRepository.count();
        long documentsCount = documentsRepository.count();
        long notificationsCount = notificationRepository.count();

        return AdminDashboardStatsVO.builder()
                .newUsersCount(usersCount)
                .newUsersGrowth("+12%")
                .newPostsCount(postsCount)
                .newPostsGrowth("+8%")
                .newDocumentsCount(documentsCount)
                .newDocumentsGrowth("+15%")
                .newNotificationsCount(notificationsCount)
                .newNotificationsGrowth("+5%")
                .build();
    }

}
