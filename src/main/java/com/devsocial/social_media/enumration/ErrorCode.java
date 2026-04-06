package com.devsocial.social_media.enumration;

public enum ErrorCode {
    USER_ALREADY_EXIST("409","User already exist"),
    POST_NOT_EXIST("404","Post not exist"),
    MESSAGE_NOT_EXIST("404","Message not exist"),
    COMMENT_NOT_EXIST("404","Comment not exist"),
    IMAGE_NOT_EXIST("404","Image not exist"),
    FILE_NOT_EXIST("404","File not exist"),
    DOCUMENT_NOT_FOUND("404","Document not found"),
    FORBIDDEN("403","You do not have permission to perform this action"),
    TOKEN_NOT_CORRECT("401","Token not correct"),
    USER_NOT_ALREADY_EXIST("409","User not already exist"),
    USER_NOT_FOUND("409","User not found"),
    PASSWORD_NOT_CORRECT("401","Password not correct"),
    TOKEN_NOT_EXIST("404","Token not exist"),
    TOKEN_EXPIRED("401","Token expired"),
    TOKEN_INVAlID("401","Token invalid"),
    CLASS_NOT_EXIST("404","Class not exist"),
    MAJOR_NOT_EXIST("404","Major not exist"),
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
