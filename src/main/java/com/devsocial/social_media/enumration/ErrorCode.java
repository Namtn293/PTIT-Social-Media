package com.devsocial.social_media.enumration;

public enum ErrorCode {
    USER_ALREADY_EXIST("409","User already exist"),
    POST_ALREADY_EXIST("409","Post already exist"),
    COMMENT_ALREADY_EXIST("409","Comment already exist"),
    POST_NOT_EXIST("409","Post not already exist"),
    COMMENT_NOT_EXIST("409","Comment not already exist"),
    MESSAGE_NOT_EXIST("409","Message not already exist"),
    FORBIDDEN("403","FORBIDDEN"),
    USER_NOT_ALREADY_EXIST("409","User not already exist"),
    PASSWORD_NOT_ALREADY_EXIST("409","Password not already exist"),
    TOKEN_NOT_ALREADY_EXIST("409","Token not already exist"),
    PASSWORD_NOT_CORRECT("401","Password not correct"),
    TOKEN_NOT_EXIST("409","Token not exist"),
    TOKEN_NOT_CORRECT("401","Token not correct"),

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
