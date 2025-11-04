package com.share2go.service;

import java.util.List;

import com.share2go.dto.NotificationDTO;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO dto);

    List<NotificationDTO> getUserNotifications(Long userId);

    long getUnreadCount(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);
}

