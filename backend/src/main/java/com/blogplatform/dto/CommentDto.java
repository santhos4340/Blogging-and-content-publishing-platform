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
public class CommentDto {
    private UUID id;
    private UUID blogId;
    private UUID userId;
    private String userName;

    @NotBlank(message = "Comment content cannot be blank")
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
