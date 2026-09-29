package com.example.cleanliness;

import com.example.cleanliness.dto.report.RejectReportRequest;
import com.example.cleanliness.dto.report.ReportCreateRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.ForbiddenException;
import com.example.cleanliness.repository.ReportRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.UserPrincipal;
import com.example.cleanliness.service.AdminReportService;
import com.example.cleanliness.service.ReportService;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ReportSecurityAndOwnershipTest {

    @Autowired
    private ReportService reportService;

    @Autowired
    private AdminReportService adminReportService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User userA;
    private User userB;
    private User staff;
    private User admin;

    @BeforeEach
    void setUp() {
        reportRepository.deleteAll();
        userRepository.deleteAll();

        userA = new User();
        userA.setFullName("User A");
        userA.setUsername("user_a");
        userA.setEmail("usera@kebersihan.id");
        userA.setPassword(passwordEncoder.encode("password123"));
        userA.setRole(Role.USER);
        userA = userRepository.save(userA);

        userB = new User();
        userB.setFullName("User B");
        userB.setUsername("user_b");
        userB.setEmail("userb@kebersihan.id");
        userB.setPassword(passwordEncoder.encode("password123"));
        userB.setRole(Role.USER);
        userB = userRepository.save(userB);

        staff = new User();
        staff.setFullName("Staff Petugas");
        staff.setUsername("staff_petugas");
        staff.setEmail("staff@kebersihan.id");
        staff.setPassword(passwordEncoder.encode("password123"));
        staff.setRole(Role.STAFF);
        staff = userRepository.save(staff);

        admin = new User();
        admin.setFullName("Admin Utama");
        admin.setUsername("admin_utama");
        admin.setEmail("admin@kebersihan.id");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRole(Role.ADMIN);
        admin = userRepository.save(admin);
    }

    private void authenticateAs(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("1. User Cannot Access Another User's Report (Ownership Enforcement)")
    void testUserCannotAccessOtherUsersReport() {
        // User A creates a report
        authenticateAs(userA);
        ReportCreateRequest req = new ReportCreateRequest("Gedung A Lt 1", "Masalah User A");
        ReportResponse reportA = reportService.createReport(req, null);

        // User A can access own report
        ReportResponse ownReport = reportService.getReportById(reportA.getId());
        assertNotNull(ownReport);

        // User B tries to access User A's report -> ForbiddenException
        authenticateAs(userB);
        assertThrows(ForbiddenException.class, () -> reportService.getReportById(reportA.getId()));
    }

    @Test
    @DisplayName("2. Staff Cannot Access PENDING_VERIFICATION Report")
    void testStaffCannotAccessPendingReport() {
        authenticateAs(userA);
        ReportCreateRequest req = new ReportCreateRequest("Gedung A Lt 1", "Pending Report");
        ReportResponse created = reportService.createReport(req, null);

        // Staff tries to access directly via ID -> ForbiddenException
        authenticateAs(staff);
        assertThrows(ForbiddenException.class, () -> reportService.getReportById(created.getId()));
    }

    @Test
    @DisplayName("3. Staff Cannot Access REJECTED Report")
    void testStaffCannotAccessRejectedReport() {
        authenticateAs(userA);
        ReportCreateRequest req = new ReportCreateRequest("Gedung A Lt 1", "To be rejected");
        ReportResponse created = reportService.createReport(req, null);

        // Admin rejects it
        authenticateAs(admin);
        adminReportService.rejectReport(created.getId(), new RejectReportRequest("Foto buram"));

        // Staff tries to access directly via ID -> ForbiddenException
        authenticateAs(staff);
        assertThrows(ForbiddenException.class, () -> reportService.getReportById(created.getId()));
    }

    @Test
    @DisplayName("4. Admin Can Access Any Report Regardless of Owner or Status")
    void testAdminCanAccessAnyReport() {
        authenticateAs(userA);
        ReportCreateRequest req = new ReportCreateRequest("Gedung A Lt 1", "Pending Report for Admin");
        ReportResponse created = reportService.createReport(req, null);

        authenticateAs(admin);
        ReportResponse accessedByAdmin = reportService.getReportById(created.getId());
        assertNotNull(accessedByAdmin);
        assertEquals(created.getId(), accessedByAdmin.getId());
    }
}
