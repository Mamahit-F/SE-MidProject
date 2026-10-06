package com.example.cleanliness.service;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.RejectReportRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.InvalidStatusTransitionException;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.mapper.ReportMapper;
import com.example.cleanliness.repository.ReportRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;
    private final NotificationService notificationService;

    public AdminReportService(ReportRepository reportRepository, ReportMapper reportMapper, NotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.reportMapper = reportMapper;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getPendingReportsList() {
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> page = reportRepository.findByStatus(ReportStatus.PENDING_VERIFICATION, pageable);
        return page.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReportResponse> getPendingReports(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findAdminReportsWithFilter(
                ReportStatus.PENDING_VERIFICATION,
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
    public PagedResponse<ReportResponse> getAllReports(ReportStatus status, String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = "asc".equalsIgnoreCase(sortDir) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Report> reportPage = reportRepository.findAdminReportsWithFilter(
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
    public List<ReportResponse> getAllReportsList(ReportStatus status, String search) {
        Pageable pageable = PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findAdminReportsWithFilter(
                status,
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                pageable
        );

        return reportPage.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponse approveReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan dengan ID " + id + " tidak ditemukan"));

        // Strict Status Transition Rule: Only PENDING_VERIFICATION -> APPROVED
        if (report.getStatus() != ReportStatus.PENDING_VERIFICATION) {
            throw new InvalidStatusTransitionException(
                    "Laporan tidak dapat disetujui karena status saat ini adalah: " + report.getStatus().getDisplayName() + 
                    ". Hanya laporan 'Menunggu Verifikasi' yang dapat disetujui."
            );
        }

        report.setStatus(ReportStatus.APPROVED);
        report.setApprovedAt(LocalDateTime.now());
        report.setRejectionReason(null);

        Report savedReport = reportRepository.save(report);

        // Notify reporter (User) and cleaning team (Staff)
        notificationService.notifyUser(
                savedReport.getReporter(),
                "Laporan Diterima",
                "Laporan Anda telah diterima dan akan diproses oleh petugas.",
                "REPORT_APPROVED",
                savedReport.getId()
        );
        notificationService.notifyStaff(
                "Laporan Baru",
                "Ada laporan baru yang telah disetujui dan siap diproses.",
                "REPORT_APPROVED",
                savedReport.getId()
        );

        return reportMapper.toResponse(savedReport);
    }

    @Transactional
    public ReportResponse rejectReport(Long id, RejectReportRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan dengan ID " + id + " tidak ditemukan"));

        // Strict Status Transition Rule: Only PENDING_VERIFICATION -> REJECTED
        if (report.getStatus() != ReportStatus.PENDING_VERIFICATION) {
            throw new InvalidStatusTransitionException(
                    "Laporan tidak dapat ditolak karena status saat ini adalah: " + report.getStatus().getDisplayName() + 
                    ". Hanya laporan 'Menunggu Verifikasi' yang dapat ditolak."
            );
        }

        if (request == null || request.getReason() == null || request.getReason().trim().isEmpty()) {
            throw new BadRequestException("Alasan penolakan laporan wajib diisi");
        }

        report.setStatus(ReportStatus.REJECTED);
        report.setRejectionReason(request.getReason().trim());

        Report savedReport = reportRepository.save(report);

        // Notify reporter (User) only - Staff MUST NOT receive notification on rejection
        String rejectionMsg = (savedReport.getRejectionReason() != null && !savedReport.getRejectionReason().trim().isEmpty())
                ? "Laporan Anda telah ditolak oleh admin. Alasan: " + savedReport.getRejectionReason()
                : "Laporan Anda telah ditolak oleh admin.";

        notificationService.notifyUser(
                savedReport.getReporter(),
                "Laporan Ditolak",
                rejectionMsg,
                "REPORT_REJECTED",
                savedReport.getId()
        );

        return reportMapper.toResponse(savedReport);
    }
}
