package com.share2go.auth;

public class LoginResponse {
    private String accessToken;
    private Long userId;
    private String name;
    private String role;

    public LoginResponse(String accessToken, Long userId, String name, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}