package com.blogplatform.dto;

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
public class BlogDto {
    private UUID id;
    private UUID authorId;
    private String authorName;

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    @NotBlank(message = "Content is required")
    private String content;

    private String excerpt;
    private String featuredImage;
    private String status; // DRAFT or PUBLISHED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
