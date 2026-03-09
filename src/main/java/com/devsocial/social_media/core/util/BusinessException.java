package com.devsocial.social_media.core.util;

import com.devsocial.social_media.enumration.ErrorCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException{
    private final ErrorCode errorCode;
    public BusinessException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode=errorCode;
    }

    public String getStatus(){
        return errorCode.getCode();
    }
}
