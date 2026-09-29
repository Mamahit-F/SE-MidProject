package com.example.cleanliness.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @JsonAlias({"name", "fullName"})
    @Size(min = 2, max = 100, message = "Nama lengkap harus antara 2 hingga 100 karakter")
    private String fullName;

    private String name;

    @NotBlank(message = "Username wajib diisi")
    @Size(min = 3, max = 50, message = "Username minimal 3 karakter")
    private String username;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;

    private String phone;
    private String department;

    public RegisterRequest() {
    }

    public RegisterRequest(String fullName, String username, String email, String password, String phone, String department) {
        this.fullName = fullName;
        this.name = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.department = department;
    }

    public String getEffectiveFullName() {
        if (fullName != null && !fullName.trim().isEmpty()) {
            return fullName.trim();
        }
        if (name != null && !name.trim().isEmpty()) {
            return name.trim();
        }
        return "";
    }

    public String getFullName() {
        return fullName != null ? fullName : name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
        if (this.name == null) {
            this.name = fullName;
        }
    }

    public String getName() {
        return name != null ? name : fullName;
    }

    public void setName(String name) {
        this.name = name;
        if (this.fullName == null) {
            this.fullName = name;
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}

