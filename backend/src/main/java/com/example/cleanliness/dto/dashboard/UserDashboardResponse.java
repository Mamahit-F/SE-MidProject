package com.example.cleanliness.dto.dashboard;

public class UserDashboardResponse {

    private long totalReports;
    private long pendingVerification;
    private long approvedReports;
    private long processingReports;
    private long resolvedReports;
    private long rejectedReports;

    // UI aliases
    private long waiting;
    private long inProgress;
    private long resolved;

    public UserDashboardResponse() {
    }

    public UserDashboardResponse(long totalReports, long pendingVerification, long approvedReports,
                                 long processingReports, long resolvedReports, long rejectedReports) {
        this.totalReports = totalReports;
        this.pendingVerification = pendingVerification;
        this.approvedReports = approvedReports;
        this.processingReports = processingReports;
        this.resolvedReports = resolvedReports;
        this.rejectedReports = rejectedReports;
        this.waiting = pendingVerification;
        this.inProgress = processingReports;
        this.resolved = resolvedReports;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getPendingVerification() {
        return pendingVerification;
    }

    public void setPendingVerification(long pendingVerification) {
        this.pendingVerification = pendingVerification;
        this.waiting = pendingVerification;
    }

    public long getApprovedReports() {
        return approvedReports;
    }

    public void setApprovedReports(long approvedReports) {
        this.approvedReports = approvedReports;
    }

    public long getProcessingReports() {
        return processingReports;
    }

    public void setProcessingReports(long processingReports) {
        this.processingReports = processingReports;
        this.inProgress = processingReports;
    }

    public long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(long resolvedReports) {
        this.resolvedReports = resolvedReports;
        this.resolved = resolvedReports;
    }

    public long getRejectedReports() {
        return rejectedReports;
    }

    public void setRejectedReports(long rejectedReports) {
        this.rejectedReports = rejectedReports;
    }

    public long getWaiting() {
        return waiting;
    }

    public void setWaiting(long waiting) {
        this.waiting = waiting;
    }

    public long getInProgress() {
        return inProgress;
    }

    public void setInProgress(long inProgress) {
        this.inProgress = inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public void setResolved(long resolved) {
        this.resolved = resolved;
    }
}
