package com.devsocial.social_media.configuration;

import com.devsocial.social_media.core.auth.entity.Token;
import com.devsocial.social_media.core.auth.repository.TokenRepository;
import com.devsocial.social_media.core.auth.service.JwtService;
import com.devsocial.social_media.core.configuration.ThreadContext;
import com.devsocial.social_media.core.util.BusinessException;
import com.devsocial.social_media.enumration.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class AuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;

    public AuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService, TokenRepository tokenRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.tokenRepository = tokenRepository;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,@NotNull HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException , BusinessException {
        if (request.getServletPath().contains("/auth")){
            filterChain.doFilter(request,response);
            return;
        }
        String header=request.getHeader("Authorization");
        if (header==null || !header.startsWith("Bearer")){
            filterChain.doFilter(request,response);
            return;
        }

        String jwt=header.substring(7);
        String userName;

        try{
            userName=jwtService.getUserName(jwt);
        } catch (ExpiredJwtException e){
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        } catch (JwtException e){
            throw new BusinessException(ErrorCode.TOKEN_INVAlID);
        }

        if (userName!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails=userDetailsService.loadUserByUsername(userName);
            Token token=tokenRepository.findByToken(jwt).orElseThrow(()->new BusinessException(ErrorCode.TOKEN_NOT_EXIST));
            if (!token.isExpired() && !token.isRevoked() && token!=null){
                UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                ThreadContext.setUserDetail(userDetails);
            }
        }
        filterChain.doFilter(request,response);}
}
