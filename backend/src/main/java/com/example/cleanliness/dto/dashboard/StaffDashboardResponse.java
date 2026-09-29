package com.example.cleanliness.dto.dashboard;

public class StaffDashboardResponse {

    private long totalApproved;
    private long totalProcessing;
    private long totalResolved;
    private long totalReports;

    // Compatibility aliases for frontend
    private long waiting;
    private long inProgress;
    private long resolved;

    public StaffDashboardResponse() {
    }

    public StaffDashboardResponse(long totalApproved, long totalProcessing, long totalResolved) {
        this.totalApproved = totalApproved;
        this.totalProcessing = totalProcessing;
        this.totalResolved = totalResolved;
        this.totalReports = totalApproved + totalProcessing + totalResolved;
        this.waiting = totalApproved;
        this.inProgress = totalProcessing;
        this.resolved = totalResolved;
    }

    public long getTotalApproved() {
        return totalApproved;
    }

    public void setTotalApproved(long totalApproved) {
        this.totalApproved = totalApproved;
        this.waiting = totalApproved;
    }

    public long getTotalProcessing() {
        return totalProcessing;
    }

    public void setTotalProcessing(long totalProcessing) {
        this.totalProcessing = totalProcessing;
        this.inProgress = totalProcessing;
    }

    public long getTotalResolved() {
        return totalResolved;
    }

    public void setTotalResolved(long totalResolved) {
        this.totalResolved = totalResolved;
        this.resolved = totalResolved;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
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
