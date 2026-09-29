package com.example.cleanliness.dto.auth;

import com.example.cleanliness.entity.Role;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @Size(min = 2, max = 100, message = "Nama lengkap harus antara 2 hingga 100 karakter")
    private String fullName;

    private String name;
    private String phone;
    private String department;
    private Role role;
    private String avatar;
    private String password;

    public UpdateUserRequest() {
    }

    public String getEffectiveFullName() {
        if (fullName != null && !fullName.trim().isEmpty()) {
            return fullName.trim();
        }
        if (name != null && !name.trim().isEmpty()) {
            return name.trim();
        }
        return null;
    }

    public String getFullName() {
        return fullName != null ? fullName : name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
