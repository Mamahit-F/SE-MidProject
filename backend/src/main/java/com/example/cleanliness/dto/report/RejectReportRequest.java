package com.example.cleanliness.dto.report;

import jakarta.validation.constraints.NotBlank;

public class RejectReportRequest {

    @NotBlank(message = "Alasan penolakan laporan wajib diisi")
    private String reason;

    public RejectReportRequest() {
    }

    public RejectReportRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
