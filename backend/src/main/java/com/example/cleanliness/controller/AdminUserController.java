package com.example.cleanliness.controller;

import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.auth.UpdateUserRequest;
import com.example.cleanliness.dto.auth.UserResponse;
import com.example.cleanliness.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Admin User Management", description = "Endpoints manajemen data akun Pelapor, Petugas, dan Administrator")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/api/admin/users", "/api/users"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Daftar Pengguna", description = "Mengambil daftar seluruh pengguna dengan filter peran dan pencarian")
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        List<UserResponse> list = userService.getUsers(role, search);
        return ResponseEntity.ok(list);
    }

    @GetMapping({"/api/admin/staff"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Daftar Petugas Kebersihan", description = "Mengambil daftar seluruh akun staf/petugas kebersihan")
    public ResponseEntity<List<UserResponse>> getAllStaff() {
        List<UserResponse> list = userService.getAllStaff();
        return ResponseEntity.ok(list);
    }

    @GetMapping({"/api/admin/users/{id}", "/api/users/{id}"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Detail Pengguna", description = "Mengambil rincian akun pengguna berdasarkan ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/admin/users", "/api/users"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tambah Pengguna Baru (Admin)", description = "Membuat akun baru untuk Pelapor, Petugas, atau Administrator")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.createUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping({"/api/admin/users/{id}", "/api/users/{id}"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Perbarui Data Pengguna", description = "Memperbarui informasi nama, departemen, kontak, peran, atau foto akun pengguna")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping({"/api/admin/users/{id}/toggle-status", "/api/users/{id}/toggle-status"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle Status Akun", description = "Mengubah status akun antara AKTIF dan NONAKTIF")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        UserResponse response = userService.toggleUserStatus(id);
        return ResponseEntity.ok(response);
    }
}
