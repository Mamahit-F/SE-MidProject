package com.example.cleanliness;

import com.example.cleanliness.dto.auth.AuthResponse;
import com.example.cleanliness.dto.auth.LoginRequest;
import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.ConflictException;
import com.example.cleanliness.exception.UnauthorizedException;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("1. User Registration Success")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Ahmad Subagyo");
        request.setUsername("ahmad_subagyo");
        request.setEmail("ahmad@kampus.id");
        request.setPassword("password123");
        request.setPhone("08123456789");
        request.setDepartment("Fakultas Ilmu Komputer");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getUser());
        assertEquals("Ahmad Subagyo", response.getUser().getFullName());
        assertEquals("ahmad_subagyo", response.getUser().getUsername());
        assertEquals(Role.USER, response.getUser().getRole());
    }

    @Test
    @DisplayName("2. User Registration Duplicate Username Should Throw Conflict")
    void testRegisterDuplicateUsername() {
        RegisterRequest req1 = new RegisterRequest();
        req1.setFullName("User Pertama");
        req1.setUsername("duplicate_user");
        req1.setEmail("user1@kampus.id");
        req1.setPassword("password123");
        authService.register(req1);

        RegisterRequest req2 = new RegisterRequest();
        req2.setFullName("User Kedua");
        req2.setUsername("duplicate_user");
        req2.setEmail("user2@kampus.id");
        req2.setPassword("password123");

        assertThrows(ConflictException.class, () -> authService.register(req2));
    }

    @Test
    @DisplayName("3. User Login Success with Correct Credentials")
    void testLoginSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Budi Hartono");
        req.setUsername("budi_hartono");
        req.setEmail("budi@kampus.id");
        req.setPassword("rahasia123");
        authService.register(req);

        LoginRequest loginReq = new LoginRequest("budi_hartono", "rahasia123");
        AuthResponse response = authService.login(loginReq);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Budi Hartono", response.getUser().getFullName());
    }

    @Test
    @DisplayName("4. User Login Failed with Wrong Password")
    void testLoginWrongPassword() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Citra Lestari");
        req.setUsername("citra_lestari");
        req.setEmail("citra@kampus.id");
        req.setPassword("benar123");
        authService.register(req);

        LoginRequest loginReq = new LoginRequest("citra_lestari", "salah123");
        assertThrows(UnauthorizedException.class, () -> authService.login(loginReq));
    }

    @Test
    @DisplayName("5. Update Profile and Profile Photo for Authenticated User")
    void testUpdateProfileAndPhoto() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Dedi Mulyadi");
        req.setUsername("dedi_mulyadi");
        req.setEmail("dedi@kampus.id");
        req.setPassword("pass12345");
        AuthResponse auth = authService.register(req);

        User user = userRepository.findByUsername("dedi_mulyadi").orElseThrow();
        com.example.cleanliness.security.UserPrincipal principal = com.example.cleanliness.security.UserPrincipal.create(user);
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        principal, null, principal.getAuthorities()
                )
        );

        com.example.cleanliness.dto.auth.UpdateUserRequest updateReq = new com.example.cleanliness.dto.auth.UpdateUserRequest();
        updateReq.setFullName("Dedi Mulyadi S.Kom");
        updateReq.setPhone("0899999999");
        updateReq.setDepartment("Fakultas Teknik");

        com.example.cleanliness.dto.auth.UserResponse updated = authService.updateProfile(updateReq);
        assertEquals("Dedi Mulyadi S.Kom", updated.getFullName());
        assertEquals("0899999999", updated.getPhone());
        assertEquals("Fakultas Teknik", updated.getDepartment());

        // Test Photo Upload
        org.springframework.mock.web.MockMultipartFile mockFile = new org.springframework.mock.web.MockMultipartFile(
                "file", "my_avatar.png", "image/png", new byte[]{1, 2, 3, 4}
        );
        com.example.cleanliness.dto.auth.UserResponse photoUpdated = authService.updateProfilePhoto(mockFile);
        assertNotNull(photoUpdated.getAvatar());
        assertTrue(photoUpdated.getAvatar().startsWith("/uploads/"));
    }
}
