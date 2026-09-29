package com.example.cleanliness;

import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.common.PagedResponse;
import com.example.cleanliness.dto.report.RejectReportRequest;
import com.example.cleanliness.dto.report.ReportCreateRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.ForbiddenException;
import com.example.cleanliness.exception.InvalidStatusTransitionException;
import com.example.cleanliness.repository.ReportRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.UserPrincipal;
import com.example.cleanliness.service.AdminReportService;
import com.example.cleanliness.service.ReportService;
import com.example.cleanliness.service.StaffReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ReportWorkflowTest {

    @Autowired
    private ReportService reportService;

    @Autowired
    private AdminReportService adminReportService;

    @Autowired
    private StaffReportService staffReportService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private User testStaff;
    private User testAdmin;

    @BeforeEach
    void setUp() {
        reportRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = new User();
        testUser.setFullName("User Pelapor");
        testUser.setUsername("user_pelapor");
        testUser.setEmail("user@kebersihan.id");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setRole(Role.USER);
        testUser = userRepository.save(testUser);

        // Create test staff
        testStaff = new User();
        testStaff.setFullName("Petugas Kebersihan");
        testStaff.setUsername("staff_kebersihan");
        testStaff.setEmail("staff@kebersihan.id");
        testStaff.setPassword(passwordEncoder.encode("password123"));
        testStaff.setRole(Role.STAFF);
        testStaff = userRepository.save(testStaff);

        // Create test admin
        testAdmin = new User();
        testAdmin.setFullName("Administrator Utama");
        testAdmin.setUsername("admin_utama");
        testAdmin.setEmail("admin@kebersihan.id");
        testAdmin.setPassword(passwordEncoder.encode("password123"));
        testAdmin.setRole(Role.ADMIN);
        testAdmin = userRepository.save(testAdmin);
    }

    private void authenticateAs(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("1. Create Report - Default Status Must Be PENDING_VERIFICATION")
    void testCreateReportDefaultStatus() {
        authenticateAs(testUser);

        ReportCreateRequest request = new ReportCreateRequest();
        request.setLocation("Gedung A - Lantai 2");
        request.setCategory("Lobi & Koridor");
        request.setDescription("Terdapat tumpahan kopi manis di lantai koridor depan A204.");
        request.setUrgency("HIGH");
        request.setImageUrl("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800");

        ReportResponse response = reportService.createReport(request, null);

        assertNotNull(response);
        assertEquals(ReportStatus.PENDING_VERIFICATION, response.getStatus());
        assertEquals("Menunggu Verifikasi", response.getStatusDisplayName());
        assertNull(response.getApprovedAt());
        assertNull(response.getProcessedAt());
        assertNull(response.getResolvedAt());
        assertNull(response.getRejectionReason());
    }

    @Test
    @DisplayName("2. Admin Sees Laporan Menunggu Verifikasi in Pending Queue")
    void testAdminPendingQueue() {
        authenticateAs(testUser);
        ReportCreateRequest req1 = new ReportCreateRequest("Gedung A Lt 1", "Sampah berserakan di lobi");
        reportService.createReport(req1, null);

        ReportCreateRequest req2 = new ReportCreateRequest("Gedung B Lt 2", "Toilet tersumbat");
        reportService.createReport(req2, null);

        authenticateAs(testAdmin);
        List<ReportResponse> pendingList = adminReportService.getPendingReportsList();

        assertEquals(2, pendingList.size());
        assertTrue(pendingList.stream().allMatch(r -> r.getStatus() == ReportStatus.PENDING_VERIFICATION));
    }

    @Test
    @DisplayName("3. Admin Approves Report - Status Transitions to APPROVED")
    void testAdminApproveReport() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Gedung C Lt 1", "Lantai licin kena sabun");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        ReportResponse approved = adminReportService.approveReport(created.getId());

        assertNotNull(approved);
        assertEquals(ReportStatus.APPROVED, approved.getStatus());
        assertEquals("Disetujui", approved.getStatusDisplayName());
        assertNotNull(approved.getApprovedAt());
        assertNull(approved.getRejectionReason());
    }

    @Test
    @DisplayName("4. Admin Rejects Report with Reason - Status Transitions to REJECTED")
    void testAdminRejectReport() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Area Parkir", "Foto tidak jelas");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        RejectReportRequest rejectReq = new RejectReportRequest("Foto tidak jelas dan lokasi kurang spesifik.");
        ReportResponse rejected = adminReportService.rejectReport(created.getId(), rejectReq);

        assertNotNull(rejected);
        assertEquals(ReportStatus.REJECTED, rejected.getStatus());
        assertEquals("Ditolak", rejected.getStatusDisplayName());
        assertEquals("Foto tidak jelas dan lokasi kurang spesifik.", rejected.getRejectionReason());
    }

    @Test
    @DisplayName("5. Admin Reject Requires Non-Blank Reason")
    void testAdminRejectRequiresReason() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Area Parkir", "Lokasi buram");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        assertThrows(BadRequestException.class, () -> adminReportService.rejectReport(created.getId(), new RejectReportRequest("")));
        assertThrows(BadRequestException.class, () -> adminReportService.rejectReport(created.getId(), new RejectReportRequest(null)));
    }

    @Test
    @DisplayName("6. Staff Cannot See PENDING_VERIFICATION or REJECTED in Active Queue")
    void testStaffCannotSeePendingOrRejected() {
        authenticateAs(testUser);
        // Create 1 pending report
        ReportCreateRequest reqPending = new ReportCreateRequest("Gedung A Lt 1", "Pending report");
        reportService.createReport(reqPending, null);

        // Create 1 report and reject it
        ReportCreateRequest reqReject = new ReportCreateRequest("Gedung A Lt 2", "Reject report");
        ReportResponse created2 = reportService.createReport(reqReject, null);
        authenticateAs(testAdmin);
        adminReportService.rejectReport(created2.getId(), new RejectReportRequest("Spam"));

        // Create 1 report and approve it
        authenticateAs(testUser);
        ReportCreateRequest reqApprove = new ReportCreateRequest("Gedung A Lt 3", "Approve report");
        ReportResponse created3 = reportService.createReport(reqApprove, null);
        authenticateAs(testAdmin);
        adminReportService.approveReport(created3.getId());

        // Staff queries queue
        authenticateAs(testStaff);
        List<ReportResponse> staffQueue = staffReportService.getStaffReportsList(null, null);

        assertEquals(1, staffQueue.size());
        assertEquals(created3.getId(), staffQueue.get(0).getId());
        assertEquals(ReportStatus.APPROVED, staffQueue.get(0).getStatus());

        // Staff tries to filter by PENDING_VERIFICATION or REJECTED -> ForbiddenException
        assertThrows(ForbiddenException.class, () -> staffReportService.getStaffReports(ReportStatus.PENDING_VERIFICATION, null, 0, 10));
        assertThrows(ForbiddenException.class, () -> staffReportService.getStaffReports(ReportStatus.REJECTED, null, 0, 10));
    }

    @Test
    @DisplayName("7. Staff Processes APPROVED Report - Transitions to PROCESSING")
    void testStaffProcessApprovedReport() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Gedung B Lt 1", "Tumpahan jus");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        adminReportService.approveReport(created.getId());

        authenticateAs(testStaff);
        ReportResponse processing = staffReportService.processReport(created.getId(), "Menyiapkan alat pel dan pelindung");

        assertNotNull(processing);
        assertEquals(ReportStatus.PROCESSING, processing.getStatus());
        assertEquals("Diproses", processing.getStatusDisplayName());
        assertNotNull(processing.getProcessedAt());
        assertEquals(testStaff.getId(), processing.getAssignedStaffId());
    }

    @Test
    @DisplayName("8. Staff Resolves PROCESSING Report - Transitions to RESOLVED")
    void testStaffResolveProcessingReport() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Gedung B Lt 1", "Tumpahan jus");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        adminReportService.approveReport(created.getId());

        authenticateAs(testStaff);
        staffReportService.processReport(created.getId(), "Sedang dipel");
        ReportResponse resolved = staffReportService.resolveReport(created.getId(), "Lantai sudah kering dan wangi");

        assertNotNull(resolved);
        assertEquals(ReportStatus.RESOLVED, resolved.getStatus());
        assertEquals("Ditangani", resolved.getStatusDisplayName());
        assertNotNull(resolved.getResolvedAt());
    }

    @Test
    @DisplayName("9. Invalid Status Transitions Are Strictly Blocked")
    void testInvalidStatusTransitions() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest("Gedung C Lt 2", "Sampah meluap");
        ReportResponse created = reportService.createReport(req, null);

        // Cannot process directly from PENDING_VERIFICATION
        authenticateAs(testStaff);
        assertThrows(InvalidStatusTransitionException.class, () -> staffReportService.processReport(created.getId(), null));

        // Approve it first
        authenticateAs(testAdmin);
        adminReportService.approveReport(created.getId());

        // Cannot approve again once APPROVED
        assertThrows(InvalidStatusTransitionException.class, () -> adminReportService.approveReport(created.getId()));

        // Cannot reject once APPROVED
        assertThrows(InvalidStatusTransitionException.class, () -> adminReportService.rejectReport(created.getId(), new RejectReportRequest("Alasan")));

        // Cannot resolve directly from APPROVED without PROCESSING first
        authenticateAs(testStaff);
        assertThrows(InvalidStatusTransitionException.class, () -> staffReportService.resolveReport(created.getId(), null));

        // Process it
        staffReportService.processReport(created.getId(), null);

        // Cannot process again once PROCESSING
        assertThrows(InvalidStatusTransitionException.class, () -> staffReportService.processReport(created.getId(), null));

        // Resolve it
        staffReportService.resolveReport(created.getId(), null);

        // Cannot resolve again once RESOLVED
        assertThrows(InvalidStatusTransitionException.class, () -> staffReportService.resolveReport(created.getId(), null));
    }

    @Test
    @DisplayName("10. Building Validation - GK1 and Room 301")
    void testBuildingGk1AndRoom301() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK1");
        req.setRoom("301");
        req.setDescription("Lantai kotor di kelas 301");

        ReportResponse response = reportService.createReport(req, null);

        assertNotNull(response);
        assertEquals("GK1", response.getBuilding());
        assertEquals("Gedung Kuliah 1 (GK1)", response.getBuildingDisplayName());
        assertEquals("301", response.getRoom());
        assertTrue(response.getLocation().contains("GK1"));
    }

    @Test
    @DisplayName("11. Building Validation - GK2 and Room Lab Komputer")
    void testBuildingGk2AndRoomLabKomputer() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK2");
        req.setRoom("Lab Komputer");
        req.setDescription("Banyak remahan biskuit di meja lab komputer");

        ReportResponse response = reportService.createReport(req, null);

        assertNotNull(response);
        assertEquals("GK2", response.getBuilding());
        assertEquals("Gedung Kuliah 2 (GK2)", response.getBuildingDisplayName());
        assertEquals("Lab Komputer", response.getRoom());
    }

    @Test
    @DisplayName("12. Building Validation - PARKING_LOT and Room Tempat parkir GK1")
    void testBuildingParkingLotAndRoom() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("PARKING_LOT");
        req.setRoom("Tempat parkir GK1");
        req.setDescription("Tumpukan daun di area parkir motor");

        ReportResponse response = reportService.createReport(req, null);

        assertNotNull(response);
        assertEquals("PARKING_LOT", response.getBuilding());
        assertEquals("Parking Lot", response.getBuildingDisplayName());
        assertEquals("Tempat parkir GK1", response.getRoom());
    }

    @Test
    @DisplayName("13. Building Validation - OTHER and Room Area taman belakang kampus")
    void testBuildingOtherAndRoomTaman() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("OTHER");
        req.setRoom("Area taman belakang kampus");
        req.setDescription("Sampah plastik berserakan di gazebo taman");

        ReportResponse response = reportService.createReport(req, null);

        assertNotNull(response);
        assertEquals("OTHER", response.getBuilding());
        assertEquals("Lainnya", response.getBuildingDisplayName());
        assertEquals("Area taman belakang kampus", response.getRoom());
    }

    @Test
    @DisplayName("14. Building Validation - OTHER with blank room throws BadRequestException")
    void testBuildingOtherWithBlankRoomThrowsException() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("OTHER");
        req.setRoom("   ");
        req.setDescription("Sampah plastik berserakan");

        assertThrows(BadRequestException.class, () -> reportService.createReport(req, null));
    }

    @Test
    @DisplayName("15. Building Validation - Invalid building code throws BadRequestException")
    void testInvalidBuildingThrowsException() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GEDUNG_TIDAK_VALID");
        req.setRoom("301");
        req.setDescription("Deskripsi laporan");

        assertThrows(BadRequestException.class, () -> reportService.createReport(req, null));
    }

    @Test
    @DisplayName("16. Building Validation - Room exceeds 150 characters throws BadRequestException")
    void testRoomExceedsMaxCharactersThrowsException() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK1");
        req.setRoom("A".repeat(151));
        req.setDescription("Deskripsi laporan");

        assertThrows(BadRequestException.class, () -> reportService.createReport(req, null));
    }
}
