package com.blogplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsDto {
    private long totalBlogs;
    private long publishedBlogs;
    private long draftBlogs;
    private long totalComments;
}
