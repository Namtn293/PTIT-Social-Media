package com.devsocial.social_media.service;

import com.devsocial.social_media.entity.Document;
import com.devsocial.social_media.model.dto.DocumentDTO;
import com.devsocial.social_media.model.vo.DocumentVO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DocumentsService {
    void createDocument(DocumentDTO documentDTO, MultipartFile file, MultipartFile background) throws IOException;
    void deleteDocument(Long documentId);
    List<DocumentVO> getAllDocument();

    DocumentVO convertToDocumentVO(Document document);
}
