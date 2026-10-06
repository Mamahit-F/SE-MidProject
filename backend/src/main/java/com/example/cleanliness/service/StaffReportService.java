package com.example.cleanliness.service;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.ForbiddenException;
import com.example.cleanliness.exception.InvalidStatusTransitionException;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.mapper.ReportMapper;
import com.example.cleanliness.repository.ReportRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;
    private final NotificationService notificationService;

    public StaffReportService(ReportRepository reportRepository,
                              UserRepository userRepository,
                              ReportMapper reportMapper,
                              NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.reportMapper = reportMapper;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReportResponse> getStaffReports(ReportStatus status, String search, int page, int size) {
        // Staff can only see APPROVED, PROCESSING, and optionally RESOLVED.
        // Staff is STRICTLY FORBIDDEN from viewing PENDING_VERIFICATION and REJECTED reports.
        if (status == ReportStatus.PENDING_VERIFICATION || status == ReportStatus.REJECTED) {
            throw new ForbiddenException("Petugas tidak memiliki izin untuk melihat laporan dengan status ini.");
        }

        List<ReportStatus> allowedStatuses;
        if (status != null) {
            allowedStatuses = List.of(status);
        } else {
            // Default active work queue: APPROVED and PROCESSING
            allowedStatuses = Arrays.asList(ReportStatus.APPROVED, ReportStatus.PROCESSING, ReportStatus.RESOLVED);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findStaffReportsWithFilter(
                allowedStatuses,
                status,
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                pageable
        );

        List<ReportResponse> content = reportPage.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                reportPage.getNumber(),
                reportPage.getSize(),
                reportPage.getTotalElements(),
                reportPage.getTotalPages(),
                reportPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getStaffReportsList(ReportStatus status, String search) {
        if (status == ReportStatus.PENDING_VERIFICATION || status == ReportStatus.REJECTED) {
            throw new ForbiddenException("Petugas tidak memiliki izin untuk melihat laporan dengan status ini.");
        }

        List<ReportStatus> allowedStatuses = status != null 
                ? List.of(status) 
                : Arrays.asList(ReportStatus.APPROVED, ReportStatus.PROCESSING, ReportStatus.RESOLVED);

        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findStaffReportsWithFilter(
                allowedStatuses,
                status,
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                pageable
        );

        return reportPage.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse processReport(Long id, String notes) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan dengan ID " + id + " tidak ditemukan"));

        // Strict Status Transition Rule: Only APPROVED -> PROCESSING
        if (report.getStatus() != ReportStatus.APPROVED) {
            throw new InvalidStatusTransitionException(
                    "Laporan tidak dapat diproses karena status saat ini adalah: " + report.getStatus().getDisplayName() + 
                    ". Hanya laporan yang telah 'Disetujui' Admin yang dapat mulai diproses."
            );
        }

        Long currentUserId = SecurityUtils.getCurrentUserId();
        User staff = userRepository.findById(currentUserId).orElse(null);

        report.setStatus(ReportStatus.PROCESSING);
        report.setProcessedAt(LocalDateTime.now());
        if (staff != null) {
            report.setAssignedStaff(staff);
        }
        if (notes != null && !notes.trim().isEmpty()) {
            report.setNotes(notes.trim());
        }

        Report savedReport = reportRepository.save(report);

        // Notify reporter (User) that report is being processed
        notificationService.notifyUser(
                savedReport.getReporter(),
                "Laporan Diproses",
                "Laporan Anda sedang diproses oleh petugas.",
                "REPORT_PROCESSING",
                savedReport.getId()
        );

        return reportMapper.toResponse(savedReport);
    }

    @Transactional
    public ReportResponse resolveReport(Long id, String notes) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan dengan ID " + id + " tidak ditemukan"));

        // Strict Status Transition Rule: Only PROCESSING -> RESOLVED
        if (report.getStatus() != ReportStatus.PROCESSING) {
            throw new InvalidStatusTransitionException(
                    "Laporan tidak dapat diselesaikan karena status saat ini adalah: " + report.getStatus().getDisplayName() + 
                    ". Hanya laporan yang berstatus 'Diproses' yang dapat ditandai selesai."
            );
        }

        Long currentUserId = SecurityUtils.getCurrentUserId();
        User staff = userRepository.findById(currentUserId).orElse(null);

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        if (report.getAssignedStaff() == null && staff != null) {
            report.setAssignedStaff(staff);
        }
        if (notes != null && !notes.trim().isEmpty()) {
            report.setNotes(notes.trim());
        }

        Report savedReport = reportRepository.save(report);

        // Notify reporter (User) that report is resolved
        notificationService.notifyUser(
                savedReport.getReporter(),
                "Laporan Selesai",
                "Laporan Anda telah selesai ditangani.",
                "REPORT_RESOLVED",
                savedReport.getId()
        );

        return reportMapper.toResponse(savedReport);
    }
}
