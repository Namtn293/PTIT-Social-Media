package com.devsocial.social_media.enumration;

public enum ErrorCode {
    USER_ALREADY_EXIST("409","User already exist"),
    USER_NOT_ALREADY_EXIST("409","User not already exist"),
    PASSWORD_NOT_CORRECT("401","Password not correct"),
    TOKEN_NOT_EXIST("401","Token not exist"),
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
