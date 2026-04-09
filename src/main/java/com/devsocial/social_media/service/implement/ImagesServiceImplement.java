package com.devsocial.social_media.service.implement;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.entity.Image;
import com.devsocial.social_media.entity.UserInfo;
import com.devsocial.social_media.enumration.ErrorCode;
import com.devsocial.social_media.repository.ImageRepository;
import com.devsocial.social_media.repository.UserInfoRepository;
import com.devsocial.social_media.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class ImagesServiceImplement implements ImageService {
    private final Cloudinary cloudinary;
    private final ImageRepository imageRepository;
    private final UserInfoRepository userInfoRepository;

    public ImagesServiceImplement(Cloudinary cloudinary, ImageRepository imageRepository, UserInfoRepository userInfoRepository) {
        this.cloudinary = cloudinary;
        this.imageRepository = imageRepository;
        this.userInfoRepository = userInfoRepository;
    }

    @Override
    public Image createImage(String url, String publicId) {
        Image img = Image.builder()
                .url(url)
                .publicId(publicId)
                .build();
        imageRepository.save(img);
        return img;
    }

    @Override
    public void deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.emptyMap()
            );

            System.out.println(result);
        }catch(Exception e){
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }

    @Override
    public void updateImage(UserInfo userInfo, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return;

        Image oldImg = Optional.ofNullable(userInfo.getImageId())
                .flatMap(imageRepository::findById)
                .orElseGet(() -> new Image(null, null));

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );
        String url = uploadResult.get("url").toString();
        String publicId = uploadResult.get("public_id").toString();

        Image newImg = createImage(url,publicId);
        userInfo.setImageId(newImg.getId());

        if(oldImg.getPublicId()!=null) {
            deleteImage(oldImg.getPublicId());
            imageRepository.delete(oldImg);
            System.out.println("Delete complete");
        }
    }
}
