package com.example.cleanliness.mapper;

import com.example.cleanliness.dto.auth.UserResponse;
import com.example.cleanliness.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setName(user.getFullName());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setPhone(user.getPhone());
        response.setDepartment(user.getDepartment());
        response.setAvatar(user.getAvatar() != null ? user.getAvatar() :
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
