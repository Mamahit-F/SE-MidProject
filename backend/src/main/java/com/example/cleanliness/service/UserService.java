package com.example.cleanliness.service;

import com.example.cleanliness.dto.auth.RegisterRequest;
import com.example.cleanliness.dto.auth.UpdateUserRequest;
import com.example.cleanliness.dto.auth.UserResponse;
import com.example.cleanliness.entity.Role;
import com.example.cleanliness.entity.User;
import com.example.cleanliness.entity.UserStatus;
import com.example.cleanliness.exception.BadRequestException;
import com.example.cleanliness.exception.ConflictException;
import com.example.cleanliness.exception.ResourceNotFoundException;
import com.example.cleanliness.mapper.UserMapper;
import com.example.cleanliness.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(String roleStr, String search) {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return users.stream()
                .filter(u -> {
                    if (roleStr == null || roleStr.trim().isEmpty() || "ALL".equalsIgnoreCase(roleStr)) {
                        return true;
                    }
                    try {
                        Role role = Role.valueOf(roleStr.toUpperCase());
                        return u.getRole() == role;
                    } catch (IllegalArgumentException e) {
                        return true;
                    }
                })
                .filter(u -> {
                    if (search == null || search.trim().isEmpty()) {
                        return true;
                    }
                    String q = search.trim().toLowerCase();
                    return (u.getFullName() != null && u.getFullName().toLowerCase().contains(q))
                            || (u.getUsername() != null && u.getUsername().toLowerCase().contains(q))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q))
                            || (u.getDepartment() != null && u.getDepartment().toLowerCase().contains(q));
                })
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan ID " + id + " tidak ditemukan"));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        String fullName = request.getEffectiveFullName();
        if (fullName.isEmpty()) {
            throw new BadRequestException("Nama lengkap wajib diisi");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username '" + request.getUsername() + "' sudah terdaftar.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Alamat email '" + request.getEmail() + "' sudah terdaftar.");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setUsername(request.getUsername().trim().toLowerCase());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword() != null && !request.getPassword().isEmpty() ? request.getPassword() : "password123"));
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan ID " + id + " tidak ditemukan"));

        if (request.getEffectiveFullName() != null) {
            user.setFullName(request.getEffectiveFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan ID " + id + " tidak ditemukan"));

        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllStaff() {
        return getUsers("STAFF", null);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllGeneralUsers() {
        return getUsers("USER", null);
    }
}
