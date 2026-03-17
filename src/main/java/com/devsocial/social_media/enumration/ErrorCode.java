package com.devsocial.social_media.enumration;

public enum ErrorCode {
    USER_ALREADY_EXIST("409","User already exist"),
    POST_NOT_EXIST("404","Post not exist"),
    MESSAGE_NOT_EXIST("404","Message not exist"),
    COMMENT_NOT_EXIST("404","Comment not exist"),
    IMAGE_NOT_EXIST("404","Image not exist"),
    FORBIDDEN("403","You do not have permission to perform this action")
    ;

    private final String code;
    private final String message;
    ErrorCode(String code,String message){
        this.code=code;
        this.message=message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
