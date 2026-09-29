package com.example.cleanliness.controller;

import com.example.cleanliness.dto.dashboard.UserDashboardResponse;
import com.example.cleanliness.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
@Tag(name = "User Dashboard", description = "Endpoints statistik dashboard Pelapor / User")
public class UserDashboardController {

    private final DashboardService dashboardService;

    public UserDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Statistik Dashboard User", description = "Mengambil data statistik laporan milik user (Menunggu Verifikasi, Disetujui, Diproses, Ditangani, Ditolak)")
    public ResponseEntity<UserDashboardResponse> getDashboard() {
        UserDashboardResponse response = dashboardService.getUserDashboard();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Statistik User (Alias)", description = "Alias endpoint statistik untuk integrasi frontend")
    public ResponseEntity<UserDashboardResponse> getStats() {
        UserDashboardResponse response = dashboardService.getUserDashboard();
        return ResponseEntity.ok(response);
    }
}
