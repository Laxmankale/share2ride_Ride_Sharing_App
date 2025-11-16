package com.share2go.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.share2go.model.User;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessTokenTtl;
    private final long refreshTokenTtl;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.accessTokenExpirationMs}") long accessTokenTtl,
            @Value("${jwt.refreshTokenExpirationMs}") long refreshTokenTtl) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenTtl = accessTokenTtl;
        this.refreshTokenTtl = refreshTokenTtl;
    }

    public String generateAccessToken(String username, Long userId, User.Role role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenTtl);
        return Jwts.builder()
                .setSubject(username)
                .claim("uid", userId)
                .claim("role", role.toString())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String username, Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenTtl);
        return Jwts.builder()
                .setSubject(username)
                .claim("uid", userId)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    public Jws<Claims> validate(String token) throws JwtException {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public long getRefreshTokenTtl() {
        return refreshTokenTtl;
    }

    public boolean isTokenExpired(String token) {
        try {
            return validate(token).getBody().getExpiration().before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }
}
