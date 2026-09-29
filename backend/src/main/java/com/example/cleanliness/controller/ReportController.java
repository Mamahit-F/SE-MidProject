package com.example.cleanliness.controller;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.ReportCreateRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Endpoints untuk pembuatan dan akses laporan pengaduan kebersihan")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Buat Laporan Baru (Multipart)", description = "Membuat laporan kebersihan baru dengan lampiran file foto. Status otomatis PENDING_VERIFICATION.")
    public ResponseEntity<ReportResponse> createReportMultipart(
            @Valid @ModelAttribute ReportCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ReportResponse response = reportService.createReport(request, imageFile);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE})
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Buat Laporan Baru (JSON)", description = "Membuat laporan kebersihan baru dengan payload JSON / URL foto. Status otomatis PENDING_VERIFICATION.")
    public ResponseEntity<ReportResponse> createReportJson(
            @Valid @RequestBody ReportCreateRequest request) {
        ReportResponse response = reportService.createReport(request, null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Laporan Milik Saya", description = "Mendapatkan daftar laporan milik user yang sedang login dengan filter dan paginasi.")
    public ResponseEntity<Object> getMyReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean listOnly) {
        if (listOnly) {
            List<ReportResponse> list = reportService.getMyReportsList(status, search);
            return ResponseEntity.ok(list);
        }
        PagedResponse<ReportResponse> response = reportService.getMyReports(status, search, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    @Operation(summary = "Detail Laporan", description = "Mendapatkan rincian laporan berdasarkan ID. Enforced ownership check di backend.")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    @Operation(summary = "Daftar Laporan", description = "Mendapatkan daftar laporan")
    public ResponseEntity<Object> getAllReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) String search) {
        List<ReportResponse> list = reportService.getMyReportsList(status, search);
        return ResponseEntity.ok(list);
    }
}
