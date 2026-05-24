package com.devsocial.social_media.service.implement;

import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.*;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.model.dto.PostDTO;
import com.devsocial.social_media.model.dto.PostUpdateDTO;
import com.devsocial.social_media.model.vo.*;
import com.devsocial.social_media.repository.*;
import com.devsocial.social_media.service.PostService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
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

    @Autowired
    public PostServiceImplement(PostSavesRepository postSavesRepository, PostReportRepository postReportRepository, PostLikesRepository postLikesRepository, PostsRepository postsRepository, UserInfoRepository userInfoRepository) {
        this.postsRepository = postsRepository;
        this.userInfoRepository = userInfoRepository;
        this.postLikesRepository = postLikesRepository;
        this.postReportRepository = postReportRepository;
        this.postSavesRepository = postSavesRepository;
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

    @Override
    public List<PostVO> getAllPost(){
        List<Long> postList=postsRepository.getAllId();
        return convertToVo(postList);
    }

    @Override
    public List<PostVO> getMyPosts() {
        String userName = ThreadContext.getUserDetail().getUsername();
        Long userInfoId= userInfoRepository.findIdByUserName(userName).orElseThrow(
                ()-> new BusinessException(ErrorCode.USER_NOT_ALREADY_EXIST)
        );
        List<Long> list=postsRepository.findIdByUserInfoId(userInfoId);
        System.out.println("hello");
        return convertToVo(list);
    }

    @Override
    public void updatePost(PostUpdateDTO dto) throws RuntimeException {
        Post post = postsRepository.findById(dto.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postsRepository.save(post);
    }

    @Override
    public List<PostVO> getLikePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getLikePostVO(userInfoId);
    }

    @Override
    public List<PostVO> getReportPosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getReportPostVO(userInfoId);
    }

    @Override
    public List<PostVO> getSavePosts() {
        Long userInfoId = userInfoRepository.findIdByUserName(ThreadContext.getUserDetail().getUsername()).orElse(null);
        return postsRepository.getSavePostVO(userInfoId);
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
    public GeneralCountHomeVO getPostTotalStatistic() {
        Long postTotalInThisMonth=postsRepository.getPostTotalInThisMonth();
        Long postTotalInLastMonth=postsRepository.getPostTotalInLastMonth();
        String status=postTotalInLastMonth>postTotalInThisMonth ? "Decrease" : "Increase";
        double percentage=postTotalInLastMonth!=0 ? Math.abs((double) (postTotalInThisMonth-postTotalInLastMonth)/postTotalInLastMonth)*100.0 :0.0;
        return GeneralCountHomeVO.builder()
                .count(postTotalInThisMonth)
                .percentage(Math.round(percentage*10.0)/10.0)
                .status(status)
                .build();
    }

    @Override
    public List<PostStatisticVO> getTop4EarlyPost() {
        List<PostAdminVO> postAdminVOS=postsRepository.getTop4EarlyPost();
        List<PostStatisticVO> list=new ArrayList<>();
        postAdminVOS.forEach(c->{
            String timeUnit="giây";
            Long time=0L;
            long seconds= Duration.between(c.getCreatedAt(), LocalDateTime.now()).getSeconds();
            if (seconds < 60) {
                time = seconds;
                timeUnit = "giây";

            } else if ((seconds /= 60) < 60) {
                time = seconds;
                timeUnit = "phút";

            } else if ((seconds /= 60) < 24) {
                time = seconds;
                timeUnit = "giờ";

            } else if ((seconds /= 24) < 30) {
                time = seconds;
                timeUnit = "ngày";

            } else if ((seconds /= 30) < 12) {
                time = seconds;
                timeUnit = "tháng";

            } else {
                time = seconds / 12;
                timeUnit = "năm";
            }
            list.add(PostStatisticVO.builder()
                            .timeUnit(timeUnit)
                            .time(time)
                            .fullName(c.getAuthor())
                            .content(c.getContent())
                    .build());
        });
        return list;
    }
}
