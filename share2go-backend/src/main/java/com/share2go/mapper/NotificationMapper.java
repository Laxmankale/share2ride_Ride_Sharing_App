package com.share2go.mapper;

import com.share2go.dto.NotificationDTO;
import com.share2go.model.Notification;
import com.share2go.model.User;

public class NotificationMapper {

    public static NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipient() != null ? n.getRecipient().getId() : null);
        dto.setType(n.getType());
        dto.setMessage(n.getMessage());
        dto.setReadFlag(n.isReadFlag());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setRideId(n.getRideId());
        dto.setBookingId(n.getBookingId());
        return dto;
    }

    public static Notification toEntity(NotificationDTO dto, User recipient) {
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setType(dto.getType());
        n.setMessage(dto.getMessage());
        n.setReadFlag(dto.isReadFlag());
        n.setCreatedAt(dto.getCreatedAt());
        n.setRideId(dto.getRideId());
        n.setBookingId(dto.getBookingId());
        return n;
    }
}

