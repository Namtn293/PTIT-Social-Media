package com.devsocial.social_media.core.auth.service;

import com.devsocial.social_media.core.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("$application.security.jwt.secret-key")
    private String SECRET_KEY;

    @Value("$application.security.jwt.access-token")
    private long jwtExpiration;

    @Value("$application.security.jwt.refresh-token")
    private long refreshExpiration;

    //create key with secret_key
    public Key getKey(){
        byte[] keyBytes= Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String buildToken(Map<String,Object> extraClaim,UserDetails userDetails,long expiration){
        User user=(User) userDetails;
        extraClaim.put("roles",java.util.List.of("ROLE_"+user.getRoleEnum().name()));
        return Jwts.builder()
                .setClaims(extraClaim)
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setSubject(user.getUsername())
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //build access-token
    public String buildAccessToken(UserDetails userDetails){
        return buildToken(new HashMap<>(),userDetails,jwtExpiration);
    }

    //build  refresh-token
    public String buildRefreshToken(UserDetails userDetails){
        return buildToken(new HashMap<>(),userDetails,refreshExpiration);
    }

    //get claims by jwt
    public Claims extractAllClaims(String jwt){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }

    //get one definite data from claim
    public <T> T getClaimData(String token, Function<Claims,T> exFunction){
        Claims claims=extractAllClaims(token);
        return exFunction.apply(claims);
    }

    //check token expiration
    public boolean isExpired(String token){
        Date expiredDate=getClaimData(token,Claims::getExpiration);
        return expiredDate.before(new Date());
    }

    //get userName from token
    public String getUserName(String token){
        return getClaimData(token,Claims::getSubject);
    }
}
