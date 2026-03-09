package com.devsocial.social_media.enumration;

public enum ErrorCode {
    USER_ALREADY_EXIST("409","User already exist"),
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
