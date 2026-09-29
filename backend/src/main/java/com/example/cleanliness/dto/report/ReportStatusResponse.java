package com.example.cleanliness.dto.report;

import com.example.cleanliness.entity.ReportStatus;

import java.time.LocalDateTime;

public class ReportStatusResponse {

    private Long id;
    private ReportStatus status;
    private String statusDisplayName;
    private String rejectionReason;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime processedAt;
    private LocalDateTime resolvedAt;

    public ReportStatusResponse() {
    }

    public ReportStatusResponse(Long id, ReportStatus status, String rejectionReason,
                                LocalDateTime updatedAt, LocalDateTime approvedAt,
                                LocalDateTime processedAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.status = status;
        this.statusDisplayName = status != null ? status.getDisplayName() : "";
        this.rejectionReason = rejectionReason;
        this.updatedAt = updatedAt;
        this.approvedAt = approvedAt;
        this.processedAt = processedAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
        this.statusDisplayName = status != null ? status.getDisplayName() : "";
    }

    public String getStatusDisplayName() {
        return statusDisplayName != null ? statusDisplayName : (status != null ? status.getDisplayName() : "");
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
