package com.example.cleanliness.controller;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.RejectReportRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.service.AdminReportService;
import com.example.cleanliness.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Verification & Reports", description = "Endpoints khusus Administrator untuk verifikasi, approval, rejection, dan manajemen seluruh laporan")
public class AdminReportController {

    private final AdminReportService adminReportService;
    private final ReportService reportService;

    public AdminReportController(AdminReportService adminReportService, ReportService reportService) {
        this.adminReportService = adminReportService;
        this.reportService = reportService;
    }

    @GetMapping("/pending")
    @Operation(summary = "Daftar Laporan Menunggu Verifikasi", description = "Mengambil semua laporan dengan status PENDING_VERIFICATION untuk diverifikasi oleh Admin")
    public ResponseEntity<Object> getPendingReports(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "false") boolean listOnly) {
        if (listOnly) {
            List<ReportResponse> list = adminReportService.getPendingReportsList();
            return ResponseEntity.ok(list);
        }
        PagedResponse<ReportResponse> response = adminReportService.getPendingReports(page, size, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Semua Laporan Sistem", description = "Mengambil seluruh data laporan dengan filter status, pencarian, paginasi, dan pengurutan")
    public ResponseEntity<Object> getAllReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "false") boolean listOnly) {
        if (listOnly) {
            List<ReportResponse> list = adminReportService.getAllReportsList(status, search);
            return ResponseEntity.ok(list);
        }
        PagedResponse<ReportResponse> response = adminReportService.getAllReports(status, search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detail Laporan (Admin)", description = "Mendapatkan detail laporan lengkap untuk Admin")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Setujui Laporan (Approve)", description = "Menyetujui laporan yang berstatus PENDING_VERIFICATION sehingga status berubah menjadi APPROVED dan masuk ke daftar pekerjaan Petugas")
    public ResponseEntity<ReportResponse> approveReport(@PathVariable Long id) {
        ReportResponse response = adminReportService.approveReport(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Tolak Laporan (Reject)", description = "Menolak laporan yang berstatus PENDING_VERIFICATION dengan alasan penolakan wajib. Status berubah menjadi REJECTED.")
    public ResponseEntity<ReportResponse> rejectReport(
            @PathVariable Long id,
            @Valid @RequestBody RejectReportRequest request) {
        ReportResponse response = adminReportService.rejectReport(id, request);
        return ResponseEntity.ok(response);
    }
}
