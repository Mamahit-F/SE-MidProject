package com.example.cleanliness.controller;

import com.example.cleanliness.dto.dashboard.StaffDashboardResponse;
import com.example.cleanliness.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')")
@Tag(name = "Staff Dashboard", description = "Endpoints statistik dashboard Petugas Kebersihan")
public class StaffDashboardController {

    private final DashboardService dashboardService;

    public StaffDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Statistik Dashboard Petugas", description = "Mengambil data total laporan baru (APPROVED), sedang diproses, dan selesai ditangani")
    public ResponseEntity<StaffDashboardResponse> getDashboard() {
        StaffDashboardResponse response = dashboardService.getStaffDashboard();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Statistik Petugas (Alias)", description = "Alias endpoint dashboard statistik untuk integrasi frontend")
    public ResponseEntity<StaffDashboardResponse> getStats() {
        StaffDashboardResponse response = dashboardService.getStaffDashboard();
        return ResponseEntity.ok(response);
    }
}
