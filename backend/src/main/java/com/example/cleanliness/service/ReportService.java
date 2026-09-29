package com.example.cleanliness.service;

import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.ReportCreateRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.*;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.ForbiddenException;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.mapper.ReportMapper;
import com.example.cleanliness.repository.ReportImageRepository;
import com.example.cleanliness.repository.ReportRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.SecurityUtils;
import com.example.cleanliness.security.UserPrincipal;
import com.example.cleanliness.storage.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReportService {

    public static final Set<String> VALID_BUILDINGS = new HashSet<>(Arrays.asList(
            "GK1", "GK2", "GK3", "GA", "PC", "EAST_HALL", "PARKING_LOT", "OTHER"
    ));

    private final ReportRepository reportRepository;
    private final ReportImageRepository reportImageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ReportMapper reportMapper;

    public ReportService(ReportRepository reportRepository,
                         ReportImageRepository reportImageRepository,
                         UserRepository userRepository,
                         FileStorageService fileStorageService,
                         ReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.reportImageRepository = reportImageRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.reportMapper = reportMapper;
    }

    @Transactional
    public ReportResponse createReport(ReportCreateRequest request, MultipartFile imageFile) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User pelapor tidak ditemukan"));

        String building = request.getBuilding();
        String room = request.getRoom();

        // Check building (with legacy location fallback if building not supplied)
        if (building == null || building.trim().isEmpty()) {
            if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
                building = "OTHER";
                room = request.getLocation().trim();
            } else {
                throw new BadRequestException("Gedung / Lokasi wajib dipilih");
            }
        }
        building = building.trim().toUpperCase();
        if (!VALID_BUILDINGS.contains(building)) {
            throw new BadRequestException("Gedung / Lokasi '" + building + "' tidak valid. Pilihan yang valid: GK1, GK2, GK3, GA, PC, EAST_HALL, PARKING_LOT, OTHER");
        }

        // Check room
        if (room == null || room.trim().isEmpty()) {
            throw new BadRequestException("Ruangan / Lokasi Spesifik wajib diisi");
        }
        room = room.trim();
        if (room.length() > 150) {
            throw new BadRequestException("Ruangan / Lokasi Spesifik maksimal 150 karakter");
        }

        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new BadRequestException("Deskripsi masalah kebersihan wajib diisi");
        }

        String buildingDisplay = ReportResponse.getBuildingDisplayName(building);
        String fullLocation = building.equals("OTHER") ? room : (buildingDisplay + " - " + room);

        Report report = new Report();
        report.setReporter(reporter);
        report.setBuilding(building);
        report.setRoom(room);
        report.setLocation(fullLocation);
        report.setTitle(request.getTitle());
        report.setCategory(request.getCategory() != null && !request.getCategory().trim().isEmpty() ? request.getCategory() : "Kebersihan Umum");
        report.setDescription(request.getDescription().trim());
        report.setUrgency(request.getUrgency() != null ? request.getUrgency() : "MEDIUM");
        
        // Strict Business Rule: New reports ALWAYS start as PENDING_VERIFICATION
        report.setStatus(ReportStatus.PENDING_VERIFICATION);
        report.setRejectionReason(null);

        Report savedReport = reportRepository.save(report);

        // Store file if provided
        MultipartFile effectiveFile = imageFile != null ? imageFile : request.getImage();
        if (effectiveFile != null && !effectiveFile.isEmpty()) {
            FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeFile(effectiveFile);
            ReportImage reportImage = new ReportImage(
                    savedReport,
                    fileInfo.getFileName(),
                    fileInfo.getFilePath(),
                    fileInfo.getFileType(),
                    fileInfo.getFileSize()
            );
            savedReport.addImage(reportImage);
            reportRepository.save(savedReport);
        } else if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            String url = request.getImageUrl().trim();
            ReportImage reportImage;
            if (url.startsWith("data:image/") || url.startsWith("data:application/octet-stream")) {
                FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeBase64Image(url);
                reportImage = new ReportImage(
                        savedReport,
                        fileInfo.getFileName(),
                        fileInfo.getFilePath(),
                        fileInfo.getFileType(),
                        fileInfo.getFileSize()
                );
            } else {
                reportImage = new ReportImage(
                        savedReport,
                        "foto_bukti.jpg",
                        url,
                        "image/jpeg",
                        500000L
                );
            }
            savedReport.addImage(reportImage);
            reportRepository.save(savedReport);
        }

        return reportMapper.toResponse(savedReport);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReportResponse> getMyReports(ReportStatus status, String search, int page, int size) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findByReporterWithFilter(
                reporter,
                status,
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                pageable
        );

        List<ReportResponse> content = reportPage.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                reportPage.getNumber(),
                reportPage.getSize(),
                reportPage.getTotalElements(),
                reportPage.getTotalPages(),
                reportPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReportsList(ReportStatus status, String search) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findByReporterWithFilter(
                reporter,
                status,
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                pageable
        );

        return reportPage.getContent().stream()
                .map(reportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laporan dengan ID " + id + " tidak ditemukan"));

        UserPrincipal principal = SecurityUtils.getRequiredCurrentUserPrincipal();
        Role role = principal.getRole();
        Long currentUserId = principal.getId();

        // Strict Authorization & Ownership Checks
        if (role == Role.USER) {
            if (!report.getReporter().getId().equals(currentUserId)) {
                throw new ForbiddenException("Anda tidak memiliki izin untuk mengakses laporan pengguna lain.");
            }
        } else if (role == Role.STAFF) {
            // Staff is not allowed to see PENDING_VERIFICATION or REJECTED reports
            if (report.getStatus() == ReportStatus.PENDING_VERIFICATION || report.getStatus() == ReportStatus.REJECTED) {
                throw new ForbiddenException("Petugas tidak diizinkan mengakses laporan yang belum disetujui Admin atau yang telah ditolak.");
            }
        }
        // ADMIN can access all reports

        return reportMapper.toResponse(report);
    }
}
