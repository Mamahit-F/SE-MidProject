package com.example.cleanliness.dto.report;

import com.example.cleanliness.entity.ReportStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReportResponse {

    private Long id;
    private String title;
    private String building;
    private String buildingDisplayName;
    private String room;
    private String location;
    private String category;
    private String description;
    private String urgency;
    private ReportStatus status;
    private String statusDisplayName;
    private String rejectionReason;
    private String notes;

    // Reporter details
    private Long userId;
    private Long reporterId;
    private String userName;
    private String reporterName;
    private String userEmail;
    private String reporterEmail;
    private String reporterDepartment;
    private String reporterAvatar;

    // Staff details
    private Long assignedStaffId;
    private String assignedStaffName;
    private String assignedStaffAvatar;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime processedAt;
    private LocalDateTime resolvedAt;

    // Media
    private String imageUrl;
    private List<ReportImageResponse> images = new ArrayList<>();

    // UI Timeline
    private List<TimelineItem> timeline = new ArrayList<>();

    public static class TimelineItem {
        private ReportStatus status;
        private String title;
        private String description;
        private LocalDateTime timestamp;
        private String actor;

        public TimelineItem() {
        }

        public TimelineItem(ReportStatus status, String title, String description, LocalDateTime timestamp, String actor) {
            this.status = status;
            this.title = title;
            this.description = description;
            this.timestamp = timestamp;
            this.actor = actor;
        }

        public ReportStatus getStatus() {
            return status;
        }

        public void setStatus(ReportStatus status) {
            this.status = status;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public String getActor() {
            return actor;
        }

        public void setActor(String actor) {
            this.actor = actor;
        }
    }

    public ReportResponse() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public static String getBuildingDisplayName(String buildingCode) {
        if (buildingCode == null || buildingCode.trim().isEmpty()) return "";
        switch (buildingCode.trim().toUpperCase()) {
            case "GK1": return "Gedung Kuliah 1 (GK1)";
            case "GK2": return "Gedung Kuliah 2 (GK2)";
            case "GK3": return "Gedung Kuliah 3 (GK3)";
            case "GA": return "Gedung Administrasi (GA)";
            case "PC": return "Pioneer Chapel (PC)";
            case "EAST_HALL": return "East Hall";
            case "PARKING_LOT": return "Parking Lot";
            case "OTHER": return "Lainnya";
            default: return buildingCode;
        }
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
        if (this.buildingDisplayName == null || this.buildingDisplayName.isEmpty()) {
            this.buildingDisplayName = getBuildingDisplayName(building);
        }
    }

    public String getBuildingDisplayName() {
        return buildingDisplayName != null ? buildingDisplayName : getBuildingDisplayName(building);
    }

    public void setBuildingDisplayName(String buildingDisplayName) {
        this.buildingDisplayName = buildingDisplayName;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getUserId() {
        return userId != null ? userId : reporterId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
        this.reporterId = userId;
    }

    public Long getReporterId() {
        return reporterId != null ? reporterId : userId;
    }

    public void setReporterId(Long reporterId) {
        this.reporterId = reporterId;
        this.userId = reporterId;
    }

    public String getUserName() {
        return userName != null ? userName : reporterName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
        this.reporterName = userName;
    }

    public String getReporterName() {
        return reporterName != null ? reporterName : userName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
        this.userName = reporterName;
    }

    public String getUserEmail() {
        return userEmail != null ? userEmail : reporterEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
        this.reporterEmail = userEmail;
    }

    public String getReporterEmail() {
        return reporterEmail != null ? reporterEmail : userEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
        this.userEmail = reporterEmail;
    }

    public String getReporterDepartment() {
        return reporterDepartment;
    }

    public void setReporterDepartment(String reporterDepartment) {
        this.reporterDepartment = reporterDepartment;
    }

    public String getReporterAvatar() {
        return reporterAvatar;
    }

    public void setReporterAvatar(String reporterAvatar) {
        this.reporterAvatar = reporterAvatar;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(Long assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public String getAssignedStaffName() {
        return assignedStaffName;
    }

    public void setAssignedStaffName(String assignedStaffName) {
        this.assignedStaffName = assignedStaffName;
    }

    public String getAssignedStaffAvatar() {
        return assignedStaffAvatar;
    }

    public void setAssignedStaffAvatar(String assignedStaffAvatar) {
        this.assignedStaffAvatar = assignedStaffAvatar;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<ReportImageResponse> getImages() {
        return images;
    }

    public void setImages(List<ReportImageResponse> images) {
        this.images = images;
    }

    public List<TimelineItem> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<TimelineItem> timeline) {
        this.timeline = timeline;
    }
}
