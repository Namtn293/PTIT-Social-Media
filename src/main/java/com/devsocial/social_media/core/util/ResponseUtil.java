package com.devsocial.social_media.core.util;

public class ResponseUtil {
    public static <T> SuccessResponse<T> ok(String message){
        return new SuccessResponse<>(null,message,"200");
    }

    public static <T> SuccessResponse<T> ok(String message,T data){
        return new SuccessResponse<>(data,message,"200");
    }
}
