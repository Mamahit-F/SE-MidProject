package com.example.cleanliness.exception;

import com.example.cleanliness.entity.ReportStatus;

public class InvalidStatusTransitionException extends RuntimeException {

    private final ReportStatus fromStatus;
    private final ReportStatus toStatus;

    public InvalidStatusTransitionException(String message) {
        super(message);
        this.fromStatus = null;
        this.toStatus = null;
    }

    public InvalidStatusTransitionException(ReportStatus fromStatus, ReportStatus toStatus) {
        super(String.format("Perubahan status tidak valid dari '%s' (%s) ke '%s' (%s)",
                fromStatus != null ? fromStatus.name() : "NULL",
                fromStatus != null ? fromStatus.getDisplayName() : "NULL",
                toStatus != null ? toStatus.name() : "NULL",
                toStatus != null ? toStatus.getDisplayName() : "NULL"));
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
    }

    public InvalidStatusTransitionException(ReportStatus fromStatus, ReportStatus toStatus, String message) {
        super(message);
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
    }

    public ReportStatus getFromStatus() {
        return fromStatus;
    }

    public ReportStatus getToStatus() {
        return toStatus;
    }
}
