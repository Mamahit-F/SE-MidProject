package com.example.cleanliness.service;

import com.example.cleanliness.dto.notification.NotificationResponse;
import com.example.cleanliness.entity.Notification;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.repository.NotificationRepository;
import com.example.cleanliness.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findByIdAndRecipientId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notifikasi dengan ID " + id + " tidak ditemukan"));

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return toResponse(saved);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
    }

    @Transactional
    public void notifyUser(User recipient, String title, String message, String type, Long relatedReportId) {
        if (recipient == null) {
            log.warn("Cannot send notification: recipient is null. Title: {}", title);
            return;
        }
        try {
            Notification notification = new Notification(recipient, title, message, type, relatedReportId);
            notificationRepository.save(notification);
            log.info("Notification sent to user {}: {}", recipient.getUsername(), title);
        } catch (Exception ex) {
            log.error("Failed to send notification to user {}: {}", recipient.getUsername(), ex.getMessage(), ex);
        }
    }

    @Transactional
    public void notifyAdmins(String title, String message, String type, Long relatedReportId) {
        try {
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            if (admins.isEmpty()) {
                log.warn("No admin users found to receive notification: {}", title);
                return;
            }
            for (User admin : admins) {
                Notification notification = new Notification(admin, title, message, type, relatedReportId);
                notificationRepository.save(notification);
            }
            log.info("Notification sent to {} admin(s): {}", admins.size(), title);
        } catch (Exception ex) {
            log.error("Failed to notify admins for {}: {}", title, ex.getMessage(), ex);
        }
    }

    @Transactional
    public void notifyStaff(String title, String message, String type, Long relatedReportId) {
        try {
            List<User> staffList = userRepository.findByRole(Role.STAFF);
            if (staffList.isEmpty()) {
                log.warn("No staff users found to receive notification: {}", title);
                return;
            }
            for (User staff : staffList) {
                Notification notification = new Notification(staff, title, message, type, relatedReportId);
                notificationRepository.save(notification);
            }
            log.info("Notification sent to {} staff member(s): {}", staffList.size(), title);
        } catch (Exception ex) {
            log.error("Failed to notify staff for {}: {}", title, ex.getMessage(), ex);
        }
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getRecipient() != null ? n.getRecipient().getId() : null,
                n.getRecipient() != null ? n.getRecipient().getFullName() : null,
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getRelatedReportId(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
