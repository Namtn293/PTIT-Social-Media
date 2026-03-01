package com.devsocial.social_media.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devsocial.social_media.entity.Images;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageImplement implements ImageService {
    private final Cloudinary cloudinary;
    private final ImageRepository imageRepository;
    private final UserInfoRepository userInfoRepository;

    public ImageImplement(Cloudinary cloudinary, ImageRepository imageRepository, UserInfoRepository userInfoRepository) {
        this.cloudinary = cloudinary;
        this.imageRepository = imageRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public Images createImage(String url, String publicId) {
        Images img = Images.builder()
                .url(url)
                .publicId(publicId)
                .build();
        imageRepository.save(img);
        return img;
    }

    @Override
    public void deleteImage(String url) {
        Images img = imageRepository.findByUrl(url).orElseThrow(()->new RuntimeException("Img not found"));
        try {
            Map result = cloudinary.uploader().destroy(
                    img.getPublicId(),
                    ObjectUtils.emptyMap()
            );

            System.out.println(result);
            imageRepository.delete(img);
        }catch(Exception e){
            throw new RuntimeException("Can't delete img");
        }
    }

    @Override
    public void updateImage(UserInfo userInfo, MultipartFile file) throws IOException {
        String oldUrl = userInfo.getAvatar();

        if(file!=null && !file.isEmpty()){
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );
            String url = uploadResult.get("url").toString();
            String publicId = uploadResult.get("public_id").toString();
            userInfo.setAvatar(url);

            createImage(url,publicId);

            if(oldUrl!=null)deleteImage(oldUrl);
            System.out.println("Delete complete");
        }
    }
}
