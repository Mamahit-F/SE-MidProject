package com.example.cleanliness;

import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.notification.NotificationResponse;
import com.example.cleanliness.dto.report.RejectReportRequest;
import com.example.cleanliness.dto.report.ReportCreateRequest;
import com.example.cleanliness.dto.report.ReportResponse;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.entity.UserStatus;
import com.example.cleanliness.repository.NotificationRepository;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.UserPrincipal;
import com.example.cleanliness.service.AdminReportService;
import com.example.cleanliness.service.AuthService;
import com.example.cleanliness.service.NotificationService;
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
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private AdminReportService adminReportService;

    @Autowired
    private StaffReportService staffReportService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testAdmin;
    private User testStaff;
    private User testUser;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();

        testAdmin = userRepository.findByUsername("admin_test_notif").orElseGet(() -> {
            User u = new User();
            u.setFullName("Admin Notif");
            u.setUsername("admin_test_notif");
            u.setEmail("admin_notif@test.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setRole(Role.ADMIN);
            u.setStatus(UserStatus.ACTIVE);
            return userRepository.save(u);
        });

        testStaff = userRepository.findByUsername("staff_test_notif").orElseGet(() -> {
            User u = new User();
            u.setFullName("Staff Notif");
            u.setUsername("staff_test_notif");
            u.setEmail("staff_notif@test.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setRole(Role.STAFF);
            u.setStatus(UserStatus.ACTIVE);
            return userRepository.save(u);
        });

        testUser = userRepository.findByUsername("user_test_notif").orElseGet(() -> {
            User u = new User();
            u.setFullName("User Notif");
            u.setUsername("user_test_notif");
            u.setEmail("user_notif@test.com");
            u.setPassword(passwordEncoder.encode("Password123!"));
            u.setRole(Role.USER);
            u.setStatus(UserStatus.ACTIVE);
            return userRepository.save(u);
        });
    }

    private void authenticateAs(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("TEST 1: User buat laporan -> Admin terima notifikasi Laporan Baru, User & Staff tidak")
    void testUserCreatesReport_NotifiesAdminOnly() {
        authenticateAs(testUser);

        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK1");
        req.setRoom("Ruang 101");
        req.setTitle("Kran Rusak");
        req.setDescription("Kran wastafel bocor air mengalir deras");
        req.setCategory("Toilet");
        req.setUrgency("HIGH");

        ReportResponse report = reportService.createReport(req, null);
        assertNotNull(report.getId());

        // Verify Admin received notification
        List<NotificationResponse> adminNotifs = notificationService.getUserNotifications(testAdmin.getId());
        assertEquals(1, adminNotifs.size());
        assertEquals("Laporan Baru", adminNotifs.get(0).getTitle());
        assertEquals(report.getId(), adminNotifs.get(0).getRelatedReportId());

        // Verify User received NO notifications
        List<NotificationResponse> userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(0, userNotifs.size());

        // Verify Staff received NO notifications
        List<NotificationResponse> staffNotifs = notificationService.getUserNotifications(testStaff.getId());
        assertEquals(0, staffNotifs.size());
    }

    @Test
    @DisplayName("TEST 2: Admin approve laporan -> User dapat 'Laporan Diterima', Staff dapat 'Laporan Baru'")
    void testAdminApprovesReport_NotifiesUserAndStaff() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK2");
        req.setRoom("Lantai 2");
        req.setTitle("Sampah Menumpuk");
        req.setDescription("Sampah menumpuk di lorong lantai dua");
        ReportResponse report = reportService.createReport(req, null);

        // Clear initial report creation notification for admin
        notificationRepository.deleteAll();

        // Admin approves
        authenticateAs(testAdmin);
        adminReportService.approveReport(report.getId());

        // User gets "Laporan Diterima"
        List<NotificationResponse> userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(1, userNotifs.size());
        assertEquals("Laporan Diterima", userNotifs.get(0).getTitle());
        assertEquals(report.getId(), userNotifs.get(0).getRelatedReportId());

        // Staff gets "Laporan Baru"
        List<NotificationResponse> staffNotifs = notificationService.getUserNotifications(testStaff.getId());
        assertEquals(1, staffNotifs.size());
        assertEquals("Laporan Baru", staffNotifs.get(0).getTitle());
        assertEquals(report.getId(), staffNotifs.get(0).getRelatedReportId());

        // Admin gets 0 notifications for approval
        List<NotificationResponse> adminNotifs = notificationService.getUserNotifications(testAdmin.getId());
        assertEquals(0, adminNotifs.size());
    }

    @Test
    @DisplayName("TEST 3: Admin reject laporan -> User dapat 'Laporan Ditolak', Staff TIDAK dapat notifikasi")
    void testAdminRejectsReport_NotifiesUserOnly() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GA");
        req.setRoom("R 301");
        req.setTitle("Laporan Iseng");
        req.setDescription("Deskripsi laporan tidak jelas dan ambigu");
        ReportResponse report = reportService.createReport(req, null);

        notificationRepository.deleteAll();

        // Admin rejects
        authenticateAs(testAdmin);
        RejectReportRequest rejectReq = new RejectReportRequest();
        rejectReq.setReason("Foto bukti tidak relevan");
        adminReportService.rejectReport(report.getId(), rejectReq);

        // User receives rejection notification
        List<NotificationResponse> userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(1, userNotifs.size());
        assertEquals("Laporan Ditolak", userNotifs.get(0).getTitle());
        assertTrue(userNotifs.get(0).getMessage().contains("Foto bukti tidak relevan"));

        // Staff receives NOTHING
        List<NotificationResponse> staffNotifs = notificationService.getUserNotifications(testStaff.getId());
        assertEquals(0, staffNotifs.size(), "Staff TIDAK BOLEH menerima notifikasi saat laporan ditolak");
    }

    @Test
    @DisplayName("TEST 4 & 5: Staff process & resolve laporan -> User dapat 'Laporan Diproses' dan 'Laporan Selesai'")
    void testStaffProcessAndResolve_NotifiesUser() {
        authenticateAs(testUser);
        ReportCreateRequest req = new ReportCreateRequest();
        req.setBuilding("GK3");
        req.setRoom("Lab Komputer");
        req.setTitle("AC Rusak Bocor");
        req.setDescription("Air AC menetes di atas meja praktikum");
        ReportResponse report = reportService.createReport(req, null);

        authenticateAs(testAdmin);
        adminReportService.approveReport(report.getId());

        notificationRepository.deleteAll();

        // Staff starts processing
        authenticateAs(testStaff);
        staffReportService.processReport(report.getId(), "Sedang diambil tangga");

        // User gets "Laporan Diproses"
        List<NotificationResponse> userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(1, userNotifs.size());
        assertEquals("Laporan Diproses", userNotifs.get(0).getTitle());

        // Staff resolves
        staffReportService.resolveReport(report.getId(), "Selesai dibersihkan dan diperbaiki");

        // User gets "Laporan Selesai"
        userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(2, userNotifs.size());
        assertEquals("Laporan Selesai", userNotifs.get(0).getTitle());
    }

    @Test
    @DisplayName("TEST 6: User baru register -> Admin dapat notifikasi 'Pengguna Baru'")
    void testUserRegister_NotifiesAdmin() {
        RegisterRequest reg = new RegisterRequest();
        reg.setFullName("Mahasiswa Baru");
        reg.setUsername("maba_test_notif");
        reg.setEmail("maba_notif@test.com");
        reg.setPassword("Password123!");

        authService.register(reg);

        List<NotificationResponse> adminNotifs = notificationService.getUserNotifications(testAdmin.getId());
        assertTrue(adminNotifs.stream().anyMatch(n -> n.getTitle().equals("Pengguna Baru")));
    }

    @Test
    @DisplayName("TEST 7 & 8: Unread count, mark as read, mark all as read")
    void testUnreadCountAndMarkAsRead() {
        notificationService.notifyUser(testUser, "Notif 1", "Pesan 1", "INFO", null);
        notificationService.notifyUser(testUser, "Notif 2", "Pesan 2", "INFO", null);

        assertEquals(2, notificationService.getUnreadCount(testUser.getId()));

        List<NotificationResponse> notifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(2, notifs.size());

        // Mark one as read
        NotificationResponse updated = notificationService.markAsRead(notifs.get(0).getId(), testUser.getId());
        assertTrue(updated.isRead());
        assertEquals(1, notificationService.getUnreadCount(testUser.getId()));

        // Mark all as read
        notificationService.markAllAsRead(testUser.getId());
        assertEquals(0, notificationService.getUnreadCount(testUser.getId()));
    }

    @Test
    @DisplayName("TEST 9: Security isolation - user tidak bisa membaca atau menandai notif user lain")
    void testSecurityIsolation() {
        notificationService.notifyUser(testAdmin, "Admin Only", "Rahasia Admin", "ADMIN_ALERT", null);
        notificationService.notifyUser(testUser, "User Only", "Info User", "USER_INFO", null);

        // User only sees user's notifications
        List<NotificationResponse> userNotifs = notificationService.getUserNotifications(testUser.getId());
        assertEquals(1, userNotifs.size());
        assertEquals("User Only", userNotifs.get(0).getTitle());

        // Admin only sees admin's notifications
        List<NotificationResponse> adminNotifs = notificationService.getUserNotifications(testAdmin.getId());
        assertEquals(1, adminNotifs.size());
        assertEquals("Admin Only", adminNotifs.get(0).getTitle());

        // User cannot mark Admin's notification as read
        Long adminNotifId = adminNotifs.get(0).getId();
        assertThrows(RuntimeException.class, () -> {
            notificationService.markAsRead(adminNotifId, testUser.getId());
        });
    }
}
