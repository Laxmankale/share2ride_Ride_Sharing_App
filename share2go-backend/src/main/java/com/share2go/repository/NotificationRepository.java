package com.share2go.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.share2go.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long userId);

    long countByRecipientIdAndReadFlagFalse(Long userId);
}

