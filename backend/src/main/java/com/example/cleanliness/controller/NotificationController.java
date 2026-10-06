package com.example.cleanliness.controller;

import com.example.cleanliness.dto.notification.NotificationResponse;
import com.example.cleanliness.security.SecurityUtils;
import com.example.cleanliness.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Endpoints notifikasi berbasis peran dan pengguna terautentikasi")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Daftar Notifikasi Pengguna", description = "Mengambil seluruh notifikasi milik user yang sedang terautentikasi")
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        List<NotificationResponse> notifications = notificationService.getUserNotifications(currentUserId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Jumlah Notifikasi Belum Dibaca", description = "Mengambil counter unread notification untuk badge bell UI")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        long count = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Tandai Notifikasi Dibaca", description = "Menandai sebuah notifikasi milik user sebagai telah dibaca")
    public ResponseEntity<NotificationResponse> markAsReadPatch(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        NotificationResponse updated = notificationService.markAsRead(id, currentUserId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Tandai Notifikasi Dibaca (PUT)", description = "Alias PUT untuk menandai notifikasi telah dibaca")
    public ResponseEntity<NotificationResponse> markAsReadPut(@PathVariable Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        NotificationResponse updated = notificationService.markAsRead(id, currentUserId);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Tandai Semua Notifikasi Dibaca", description = "Menandai seluruh notifikasi user sebagai telah dibaca")
    public ResponseEntity<Map<String, String>> markAllAsReadPatch() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Semua notifikasi berhasil ditandai telah dibaca"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Tandai Semua Notifikasi Dibaca (PUT)", description = "Alias PUT untuk menandai seluruh notifikasi telah dibaca")
    public ResponseEntity<Map<String, String>> markAllAsReadPut() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Semua notifikasi berhasil ditandai telah dibaca"));
    }
}
