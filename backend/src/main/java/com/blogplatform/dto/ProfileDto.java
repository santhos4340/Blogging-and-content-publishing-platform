package com.blogplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private UUID id;
    private UUID userId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Email should be valid")
    private String email;

    private String avatarUrl;
    private String bio;
    private String role; // USER or ADMIN
    private long totalBlogs;
    private long publishedBlogs;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
