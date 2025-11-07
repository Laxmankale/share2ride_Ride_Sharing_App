package com.share2go.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.share2go.dto.NotificationDTO;
import com.share2go.mapper.NotificationMapper;
import com.share2go.model.Notification;
import com.share2go.model.User;
import com.share2go.repository.NotificationRepository;
import com.share2go.repository.UserRepository;
import com.share2go.service.NotificationService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));
        Notification n = NotificationMapper.toEntity(dto, recipient);
        Notification saved = notificationRepository.save(n);
        return NotificationMapper.toDTO(saved);
    }

    @Override
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFlagFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        n.setReadFlag(true);
        notificationRepository.save(n);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            if (!n.isReadFlag()) {
                n.setReadFlag(true);
            }
        }
        notificationRepository.saveAll(list);
    }
}

