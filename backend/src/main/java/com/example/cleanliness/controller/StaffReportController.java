package com.example.cleanliness.controller;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.service.ReportService;
import com.example.cleanliness.service.StaffReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff/reports")
@PreAuthorize("hasRole('STAFF')")
@Tag(name = "Staff Reports", description = "Endpoints khusus Petugas Kebersihan untuk melihat pekerjaan dan mengupdate status pengerjaan")
public class StaffReportController {

    private final StaffReportService staffReportService;
    private final ReportService reportService;

    public StaffReportController(StaffReportService staffReportService, ReportService reportService) {
        this.staffReportService = staffReportService;
        this.reportService = reportService;
    }

    @GetMapping
    @Operation(summary = "Daftar Pekerjaan Petugas", description = "Mengambil daftar laporan yang telah disetujui (APPROVED/PROCESSING/RESOLVED). Petugas tidak dapat melihat laporan PENDING atau REJECTED.")
    public ResponseEntity<Object> getStaffReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "false") boolean listOnly) {
        if (listOnly) {
            List<ReportResponse> list = staffReportService.getStaffReportsList(status, search);
            return ResponseEntity.ok(list);
        }
        PagedResponse<ReportResponse> response = staffReportService.getStaffReports(status, search, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detail Laporan (Petugas)", description = "Mendapatkan detail laporan pekerjaan untuk Petugas. Hanya laporan yang sudah APPROVED/PROCESSING/RESOLVED yang dapat diakses.")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/process")
    @Operation(summary = "Mulai Proses Penanganan", description = "Memulai penanganan laporan yang berstatus APPROVED menjadi PROCESSING.")
    public ResponseEntity<ReportResponse> processReport(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        ReportResponse response = staffReportService.processReport(id, notes);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/resolve")
    @Operation(summary = "Selesaikan Penanganan", description = "Menandai laporan yang berstatus PROCESSING menjadi RESOLVED.")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        ReportResponse response = staffReportService.resolveReport(id, notes);
        return ResponseEntity.ok(response);
    }
}
