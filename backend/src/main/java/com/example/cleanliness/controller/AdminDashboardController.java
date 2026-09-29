package com.example.cleanliness.controller;

import com.example.cleanliness.dto.dashboard.AdminDashboardResponse;
import com.example.cleanliness.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Dashboard", description = "Endpoints analitik dan statistik dashboard Administrator")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Statistik Dashboard Admin", description = "Mengambil data ringkasan laporan, verifikasi, status, jumlah pengguna dan petugas")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Statistik Admin (Alias)", description = "Alias endpoint dashboard statistik untuk integrasi frontend")
    public ResponseEntity<AdminDashboardResponse> getStats() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(response);
    }
}
