package com.example.cleanliness.service;

import com.example.cleanliness.dto.dashboard.AdminDashboardResponse;
import com.example.cleanliness.dto.dashboard.StaffDashboardResponse;
import com.example.cleanliness.dto.dashboard.UserDashboardResponse;
import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.repository.ReportRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public DashboardService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        long totalReports = reportRepository.count();
        long pending = reportRepository.countByStatus(ReportStatus.PENDING_VERIFICATION);
        long approved = reportRepository.countByStatus(ReportStatus.APPROVED);
        long processing = reportRepository.countByStatus(ReportStatus.PROCESSING);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long rejected = reportRepository.countByStatus(ReportStatus.REJECTED);
        long totalUsers = userRepository.countByRole(Role.USER);
        long totalStaff = userRepository.countByRole(Role.STAFF);

        AdminDashboardResponse response = new AdminDashboardResponse(
                totalReports,
                pending,
                approved,
                processing,
                resolved,
                rejected,
                totalUsers,
                totalStaff
        );

        // Location ranking counts
        List<Report> allReports = reportRepository.findAll();
        Map<String, Integer> locationCounts = new HashMap<>();
        for (Report r : allReports) {
            String loc = r.getLocation();
            if (loc != null && !loc.trim().isEmpty()) {
                locationCounts.put(loc, locationCounts.getOrDefault(loc, 0) + 1);
            }
        }
        response.setLocationCounts(locationCounts);

        return response;
    }

    @Transactional(readOnly = true)
    public StaffDashboardResponse getStaffDashboard() {
        long approved = reportRepository.countByStatus(ReportStatus.APPROVED);
        long processing = reportRepository.countByStatus(ReportStatus.PROCESSING);
        long resolved = reportRepository.countByStatus(ReportStatus.RESOLVED);

        return new StaffDashboardResponse(approved, processing, resolved);
    }

    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboard() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Pengguna tidak ditemukan"));

        long total = reportRepository.countByReporter(reporter);
        long pending = reportRepository.countByReporterAndStatus(reporter, ReportStatus.PENDING_VERIFICATION);
        long approved = reportRepository.countByReporterAndStatus(reporter, ReportStatus.APPROVED);
        long processing = reportRepository.countByReporterAndStatus(reporter, ReportStatus.PROCESSING);
        long resolved = reportRepository.countByReporterAndStatus(reporter, ReportStatus.RESOLVED);
        long rejected = reportRepository.countByReporterAndStatus(reporter, ReportStatus.REJECTED);

        return new UserDashboardResponse(total, pending, approved, processing, resolved, rejected);
    }
}
