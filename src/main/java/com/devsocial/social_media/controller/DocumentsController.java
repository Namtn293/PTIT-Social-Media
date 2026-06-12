package com.devsocial.social_media.controller;

import com.devsocial.social_media.core.util.ResponseUtil;
import com.devsocial.social_media.core.util.SuccessResponse;
import com.devsocial.social_media.model.dto.DocumentDTO;
import com.devsocial.social_media.model.vo.DocumentVO;
import com.devsocial.social_media.service.DocumentsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/document/")
public class DocumentsController {
    private final DocumentsService documentsService;

    public DocumentsController(DocumentsService documentsService) {
        this.documentsService = documentsService;
    }

    @PostMapping("create")
    SuccessResponse<String> createDocument(@RequestPart("documentDTO") DocumentDTO documentDTO,
                                           @RequestPart(value = "file", required = false)MultipartFile file,
                                           @RequestPart(value = "image",required = false)MultipartFile image) throws IOException {
        documentsService.createDocument(documentDTO,file,image);
        return ResponseUtil.ok(
                "Create document success",
                null
        );
    }

    @PostMapping("delete/{documentId}")
    SuccessResponse<String> deleteDocument(@PathVariable Long documentId){
        documentsService.deleteDocument(documentId);
        return ResponseUtil.ok(
                "Delete document success",
                null
        );
    }

    @PostMapping("get")
    SuccessResponse<List<DocumentVO>> getAllDocument(){
        return ResponseUtil.ok(
                "Get all document success",
                documentsService.getAllDocument()
        );
    }

}
