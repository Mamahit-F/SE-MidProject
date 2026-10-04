package com.example.cleanliness.controller;

import com.example.cleanliness.dto.auth.AuthResponse;
import com.example.cleanliness.dto.auth.LoginRequest;
import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.auth.UserResponse;
import com.example.cleanliness.dto.common.ApiResponse;
import com.example.cleanliness.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/auth", "/auth", ""})
@Tag(name = "Authentication", description = "Endpoints untuk registrasi, login, dan autentikasi pengguna")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/register", "/auth/register", "/api/auth/register", "/api/register"})
    @Operation(summary = "Registrasi Pengguna Baru", description = "Mendaftarkan user baru dengan role USER")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (com.example.cleanliness.exception.ConflictException | com.example.cleanliness.exception.BadRequestException ex) {
            throw ex;
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            throw new com.example.cleanliness.exception.ConflictException("Username atau email sudah terdaftar.");
        } catch (org.springframework.dao.DataAccessException ex) {
            throw new com.example.cleanliness.exception.BadRequestException("Terjadi kegagalan database saat registrasi: " + (ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage()));
        } catch (Exception ex) {
            throw new com.example.cleanliness.exception.BadRequestException("Registrasi gagal: " + ex.getMessage());
        }
    }

    @PostMapping({"/login", "/auth/login", "/api/auth/login", "/api/login"})
    @Operation(summary = "Login Pengguna", description = "Login menggunakan username atau email dan password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    @Operation(summary = "Profil Pengguna", description = "Mendapatkan profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> getProfile() {
        UserResponse response = authService.getProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Perbarui Profil Pengguna", description = "Memperbarui informasi profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody com.example.cleanliness.dto.auth.UpdateUserRequest request) {
        UserResponse response = authService.updateProfile(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Current User Info", description = "Alias untuk profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse response = authService.getProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    @Operation(summary = "Update Current User Info", description = "Alias untuk perbarui profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> updateCurrentUser(@Valid @RequestBody com.example.cleanliness.dto.auth.UpdateUserRequest request) {
        UserResponse response = authService.updateProfile(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile-photo")
    @Operation(summary = "Upload Foto Profil", description = "Mengunggah foto profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> uploadProfilePhoto(
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "avatar", required = false) org.springframework.web.multipart.MultipartFile avatar) {
        org.springframework.web.multipart.MultipartFile targetFile = file != null ? file : avatar;
        if (targetFile == null || targetFile.isEmpty()) {
            throw new com.example.cleanliness.exception.BadRequestException("File foto profil wajib disertakan");
        }
        UserResponse response = authService.updateProfilePhoto(targetFile);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile-photo")
    @Operation(summary = "Perbarui Foto Profil", description = "Mengganti foto profil pengguna yang sedang login")
    public ResponseEntity<UserResponse> putProfilePhoto(
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "avatar", required = false) org.springframework.web.multipart.MultipartFile avatar) {
        org.springframework.web.multipart.MultipartFile targetFile = file != null ? file : avatar;
        if (targetFile == null || targetFile.isEmpty()) {
            throw new com.example.cleanliness.exception.BadRequestException("File foto profil wajib disertakan");
        }
        UserResponse response = authService.updateProfilePhoto(targetFile);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/profile-photo/base64")
    @Operation(summary = "Upload Foto Profil Base64", description = "Mengunggah foto profil berupa Base64")
    public ResponseEntity<UserResponse> uploadProfilePhotoBase64(@RequestBody java.util.Map<String, String> payload) {
        String base64 = payload.get("avatar") != null ? payload.get("avatar") : payload.get("image");
        if (base64 == null || base64.trim().isEmpty()) {
            throw new com.example.cleanliness.exception.BadRequestException("Data foto base64 wajib disertakan");
        }
        UserResponse response = authService.updateProfilePhotoBase64(base64);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout Pengguna", description = "Menghapus sesi login")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout berhasil"));
    }
}
