package com.blogplatform.controller;

import com.blogplatform.dto.ApiResponse;
import com.blogplatform.dto.BlogDto;
import com.blogplatform.dto.ProfileDto;
import com.blogplatform.dto.UserStatsDto;
import com.blogplatform.service.BlogService;
import com.blogplatform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BlogService blogService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getCurrentUserProfile(
            @RequestParam(name = "userId", required = false) UUID userId) {
        UUID queryUserId = (userId != null) ? userId : UUID.randomUUID();
        ProfileDto profile = userService.getProfileByUserId(queryUserId);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> updateCurrentUserProfile(
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody ProfileDto profileDto) {
        UUID queryUserId = (userId != null) ? userId : UUID.randomUUID();
        ProfileDto updated = userService.updateProfile(queryUserId, profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/me/blogs")
    public ResponseEntity<ApiResponse<List<BlogDto>>> getCurrentUserBlogs(
            @RequestParam(name = "userId", required = false) UUID userId,
            @RequestParam(name = "status", required = false, defaultValue = "ALL") String status,
            @RequestParam(name = "query", required = false) String query) {
        UUID queryUserId = (userId != null) ? userId : UUID.randomUUID();
        List<BlogDto> userBlogs = blogService.getUserBlogs(queryUserId, status, query);
        return ResponseEntity.ok(ApiResponse.success("User blogs fetched successfully", userBlogs));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<ApiResponse<UserStatsDto>> getCurrentUserStats(
            @RequestParam(name = "userId", required = false) UUID userId) {
        UUID queryUserId = (userId != null) ? userId : UUID.randomUUID();
        UserStatsDto stats = userService.getUserStats(queryUserId);
        return ResponseEntity.ok(ApiResponse.success("User statistics fetched successfully", stats));
    }
}
