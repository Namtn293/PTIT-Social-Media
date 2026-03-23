package com.devsocial.social_media.core.configuration;

import org.springframework.security.core.userdetails.UserDetails;

public class ThreadContext {
    public static final  ThreadLocal<UserDetails> userHolder=new ThreadLocal<>();

    public static UserDetails getUserDetail(){
        return userHolder.get();
    }

    public static void setUserDetail(UserDetails userDetails){
        userHolder.set(userDetails);
    }
}
