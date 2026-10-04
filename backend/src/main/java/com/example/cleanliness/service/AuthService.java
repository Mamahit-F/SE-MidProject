package com.example.cleanliness.service;

import com.example.cleanliness.dto.auth.AuthResponse;
import com.example.cleanliness.dto.auth.LoginRequest;
import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.auth.UserResponse;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.entity.UserStatus;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.ConflictException;
import com.example.cleanliness.exception.UnauthorizedException;
import com.example.cleanliness.mapper.UserMapper;
import com.example.cleanliness.repository.UserRepository;
import com.example.cleanliness.security.JwtTokenProvider;
import com.example.cleanliness.security.SecurityUtils;
import com.example.cleanliness.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final com.example.cleanliness.storage.FileStorageService fileStorageService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserMapper userMapper,
                       com.example.cleanliness.storage.FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userMapper = userMapper;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new UnauthorizedException("Pengguna tidak ditemukan"));

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new UnauthorizedException("Akun Anda sedang dinonaktifkan. Silakan hubungi Administrator.");
            }

            String token = tokenProvider.generateToken(authentication);
            UserResponse userResponse = userMapper.toResponse(user);

            return new AuthResponse(token, userResponse);
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Email/username atau kata sandi tidak sesuai.");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            String fullName = request.getEffectiveFullName();
            if (fullName.isEmpty()) {
                throw new BadRequestException("Nama lengkap wajib diisi");
            }

            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new BadRequestException("Username wajib diisi");
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new BadRequestException("Email wajib diisi");
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new BadRequestException("Password wajib diisi");
            }

            String username = request.getUsername().trim().toLowerCase();
            String email = request.getEmail().trim().toLowerCase();

            if (userRepository.existsByUsername(username)) {
                throw new ConflictException("Username '" + request.getUsername().trim() + "' sudah terdaftar.");
            }

            if (userRepository.existsByEmail(email)) {
                throw new ConflictException("Alamat email '" + request.getEmail().trim() + "' sudah terdaftar.");
            }

            User user = new User();
            user.setFullName(fullName);
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.USER);
            user.setStatus(UserStatus.ACTIVE);
            user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
            user.setDepartment(request.getDepartment() != null && !request.getDepartment().trim().isEmpty()
                    ? request.getDepartment().trim()
                    : "Mahasiswa / Civitas Kampus");
            user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

            User savedUser = userRepository.save(user);

            String token = tokenProvider.generateTokenFromUser(savedUser.getId(), savedUser.getUsername(), savedUser.getRole().name());
            UserResponse userResponse = userMapper.toResponse(savedUser);

            return new AuthResponse(token, userResponse);
        } catch (ConflictException | BadRequestException ex) {
            throw ex;
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            throw new ConflictException("Email atau username sudah terdaftar di database.");
        } catch (org.springframework.dao.DataAccessException ex) {
            throw new BadRequestException("Terjadi kegagalan database saat registrasi: " + (ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage()));
        } catch (Exception ex) {
            throw new BadRequestException("Gagal melakukan registrasi: " + ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UnauthorizedException("Pengguna tidak ditemukan"));

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(com.example.cleanliness.dto.auth.UpdateUserRequest request) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UnauthorizedException("Pengguna tidak ditemukan"));

        if (request.getEffectiveFullName() != null && !request.getEffectiveFullName().trim().isEmpty()) {
            user.setFullName(request.getEffectiveFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment().trim());
        }
        if (request.getAvatar() != null && !request.getAvatar().trim().isEmpty()) {
            user.setAvatar(request.getAvatar().trim());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse updateProfilePhoto(org.springframework.web.multipart.MultipartFile file) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UnauthorizedException("Pengguna tidak ditemukan"));

        com.example.cleanliness.storage.FileStorageService.StoredFileInfo storedFileInfo = fileStorageService.storeFile(file);
        user.setAvatar(storedFileInfo.getFilePath());
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse updateProfilePhotoBase64(String base64) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UnauthorizedException("Pengguna tidak ditemukan"));

        com.example.cleanliness.storage.FileStorageService.StoredFileInfo storedFileInfo = fileStorageService.storeBase64Image(base64);
        user.setAvatar(storedFileInfo.getFilePath());
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }
}
