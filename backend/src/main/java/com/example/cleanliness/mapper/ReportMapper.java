package com.example.cleanliness.mapper;

import com.example.cleanliness.dto.report.ReportImageResponse;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportImage;
import com.example.cleanliness.entity.ReportStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report report) {
        if (report == null) return null;

        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setTitle(report.getTitle());
        response.setBuilding(report.getBuilding());
        response.setBuildingDisplayName(ReportResponse.getBuildingDisplayName(report.getBuilding()));
        response.setRoom(report.getRoom());
        response.setLocation(report.getLocation());
        response.setCategory(report.getCategory());
        response.setDescription(report.getDescription());
        response.setUrgency(report.getUrgency());
        response.setStatus(report.getStatus());
        response.setStatusDisplayName(report.getStatus().getDisplayName());
        response.setRejectionReason(report.getRejectionReason());
        response.setNotes(report.getNotes());

        // Reporter info
        if (report.getReporter() != null) {
            response.setUserId(report.getReporter().getId());
            response.setReporterId(report.getReporter().getId());
            response.setUserName(report.getReporter().getFullName());
            response.setReporterName(report.getReporter().getFullName());
            response.setUserEmail(report.getReporter().getEmail());
            response.setReporterEmail(report.getReporter().getEmail());
            response.setReporterDepartment(report.getReporter().getDepartment());
            response.setReporterAvatar(report.getReporter().getAvatar());
        }

        // Assigned Staff info
        if (report.getAssignedStaff() != null) {
            response.setAssignedStaffId(report.getAssignedStaff().getId());
            response.setAssignedStaffName(report.getAssignedStaff().getFullName());
            response.setAssignedStaffAvatar(report.getAssignedStaff().getAvatar());
        }

        // Timestamps
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setApprovedAt(report.getApprovedAt());
        response.setProcessedAt(report.getProcessedAt());
        response.setResolvedAt(report.getResolvedAt());

        // Images
        if (report.getImages() != null && !report.getImages().isEmpty()) {
            List<ReportImageResponse> imageResponses = report.getImages().stream()
                    .map(this::toImageResponse)
                    .collect(Collectors.toList());
            response.setImages(imageResponses);
            response.setImageUrl(imageResponses.get(0).getFilePath());
        } else {
            response.setImageUrl("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800");
        }

        // Build structured timeline
        List<ReportResponse.TimelineItem> timeline = buildTimeline(report);
        response.setTimeline(timeline);

        return response;
    }

    public ReportImageResponse toImageResponse(ReportImage image) {
        if (image == null) return null;
        return new ReportImageResponse(
                image.getId(),
                image.getFileName(),
                image.getFilePath(),
                image.getFilePath(),
                image.getFileType(),
                image.getFileSize(),
                image.getCreatedAt()
        );
    }

    private List<ReportResponse.TimelineItem> buildTimeline(Report report) {
        List<ReportResponse.TimelineItem> timeline = new ArrayList<>();

        String reporterName = report.getReporter() != null ? report.getReporter().getFullName() : "Pelapor";
        String staffName = report.getAssignedStaff() != null ? report.getAssignedStaff().getFullName() : "Petugas Kebersihan";

        // Step 1: Created
        timeline.add(new ReportResponse.TimelineItem(
                ReportStatus.PENDING_VERIFICATION,
                "Laporan Dibuat",
                "Laporan diajukan oleh " + reporterName + " dan masuk ke antrean verifikasi Admin.",
                report.getCreatedAt(),
                reporterName + " (Pelapor)"
        ));

        // Step 2: Approved or Rejected
        if (report.getApprovedAt() != null || report.getStatus() == ReportStatus.APPROVED
                || report.getStatus() == ReportStatus.PROCESSING || report.getStatus() == ReportStatus.RESOLVED) {
            timeline.add(new ReportResponse.TimelineItem(
                    ReportStatus.APPROVED,
                    "Laporan Disetujui Admin",
                    "Admin telah memverifikasi laporan. Laporan kini masuk ke daftar pekerjaan Petugas Kebersihan.",
                    report.getApprovedAt() != null ? report.getApprovedAt() : report.getCreatedAt().plusMinutes(15),
                    "Administrator"
            ));
        } else if (report.getStatus() == ReportStatus.REJECTED) {
            timeline.add(new ReportResponse.TimelineItem(
                    ReportStatus.REJECTED,
                    "Laporan Ditolak Admin",
                    report.getRejectionReason() != null ? "Alasan: " + report.getRejectionReason() : "Laporan tidak dapat diverifikasi oleh Admin.",
                    report.getUpdatedAt() != null ? report.getUpdatedAt() : report.getCreatedAt().plusMinutes(10),
                    "Administrator"
            ));
        }

        // Step 3: Processing
        if (report.getProcessedAt() != null || report.getStatus() == ReportStatus.PROCESSING || report.getStatus() == ReportStatus.RESOLVED) {
            timeline.add(new ReportResponse.TimelineItem(
                    ReportStatus.PROCESSING,
                    "Penanganan Dimulai",
                    report.getNotes() != null && !report.getNotes().isEmpty() ? report.getNotes() : "Petugas telah menuju lokasi dan melakukan proses pembersihan.",
                    report.getProcessedAt() != null ? report.getProcessedAt() : (report.getApprovedAt() != null ? report.getApprovedAt().plusMinutes(20) : report.getCreatedAt().plusMinutes(35)),
                    staffName + " (Petugas)"
            ));
        }

        // Step 4: Resolved
        if (report.getResolvedAt() != null || report.getStatus() == ReportStatus.RESOLVED) {
            timeline.add(new ReportResponse.TimelineItem(
                    ReportStatus.RESOLVED,
                    "Laporan Selesai Ditangani",
                    "Area telah dibersihkan secara menyeluruh dan siap digunakan kembali.",
                    report.getResolvedAt() != null ? report.getResolvedAt() : (report.getProcessedAt() != null ? report.getProcessedAt().plusMinutes(30) : report.getCreatedAt().plusHours(1)),
                    staffName + " (Petugas)"
            ));
        }

        return timeline;
    }
}
