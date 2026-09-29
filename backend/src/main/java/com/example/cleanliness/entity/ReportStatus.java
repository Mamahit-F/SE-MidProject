package com.example.cleanliness.entity;

public enum ReportStatus {
    PENDING_VERIFICATION,
    APPROVED,
    REJECTED,
    PROCESSING,
    RESOLVED;

    public String getDisplayName() {
        return switch (this) {
            case PENDING_VERIFICATION -> "Menunggu Verifikasi";
            case APPROVED -> "Disetujui";
            case REJECTED -> "Ditolak";
            case PROCESSING -> "Diproses";
            case RESOLVED -> "Ditangani";
        };
    }
}
