package com.example.cleanliness.security;

import com.example.cleanliness.entity.Role;
import com.example.cleanliness.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {

    public static Optional<UserPrincipal> getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return Optional.of(userPrincipal);
        }
        return Optional.empty();
    }

    public static UserPrincipal getRequiredCurrentUserPrincipal() {
        return getCurrentUserPrincipal()
                .orElseThrow(() -> new UnauthorizedException("Sesi login tidak ditemukan atau kedaluwarsa"));
    }

    public static Long getCurrentUserId() {
        return getRequiredCurrentUserPrincipal().getId();
    }

    public static Role getCurrentUserRole() {
        return getRequiredCurrentUserPrincipal().getRole();
    }

    public static boolean isCurrentUserAdmin() {
        return getCurrentUserPrincipal().map(u -> u.getRole() == Role.ADMIN).orElse(false);
    }

    public static boolean isCurrentUserStaff() {
        return getCurrentUserPrincipal().map(u -> u.getRole() == Role.STAFF).orElse(false);
    }

    public static boolean isCurrentUserNormalUser() {
        return getCurrentUserPrincipal().map(u -> u.getRole() == Role.USER).orElse(false);
    }
}
