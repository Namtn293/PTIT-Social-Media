package com.devsocial.social_media.configuration;

import com.devsocial.social_media.entity.Subject;
import com.devsocial.social_media.repository.SubjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final SubjectRepository subjectRepository;

    public DatabaseSeeder(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (subjectRepository.count() == 0) {
            List<String> subjects = Arrays.asList(
                    "Giải tích 1",
                    "Giải tích 2",
                    "Đại số tuyến tính",
                    "Mạng máy tính",
                    "Lập trình hướng đối tượng",
                    "Cơ sở dữ liệu",
                    "Cấu trúc dữ liệu và giải thuật",
                    "Kỹ nghệ phần mềm",
                    "An toàn thông tin",
                    "Lập trình mạng",
                    "Lập trình Web"
            );
            for (String subName : subjects) {
                Subject subject = Subject.builder()
                        .subjectName(subName)
                        .build();
                subjectRepository.save(subject);
            }
            System.out.println("Seeded database with subjects successfully!");
        }
    }
}
