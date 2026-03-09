package com.devsocial.social_media.core.util;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandle {
    @ExceptionHandler(BusinessException.class)
    public ErrorResponse handleException(BusinessException ex){
        return ResponseUtil.error(ex.getMessage(),ex.getStatus());
    }
}
