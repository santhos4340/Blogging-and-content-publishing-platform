package com.blogplatform.controller;

import com.blogplatform.dto.*;
import com.blogplatform.entity.Category;
import com.blogplatform.entity.Profile;
import com.blogplatform.exception.ForbiddenException;
import com.blogplatform.exception.ResourceNotFoundException;
import com.blogplatform.repository.*;
import com.blogplatform.service.BlogService;
import com.blogplatform.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProfileRepository profileRepository;
    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final BlogService blogService;
    private final CommentService commentService;

    // Middleware check for ADMIN role
    private void verifyAdminRole(UUID userId) {
        if (userId != null) {
            Profile caller = profileRepository.findByUserId(userId).orElse(null);
            if (caller != null && !"ADMIN".equals(caller.getRole())) {
                throw new ForbiddenException("Access Denied: Admin authorization required.");
            }
        }
    }

    // 1. Dashboard Stats
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getAdminStats(
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);

        AdminStatsDto stats = AdminStatsDto.builder()
                .totalUsers(profileRepository.count())
                .totalBlogs(blogRepository.count())
                .publishedBlogs(blogRepository.countByAuthorIdAndStatus(null, "PUBLISHED")) // mock count
                .draftBlogs(blogRepository.countByAuthorIdAndStatus(null, "DRAFT"))
                .totalComments(commentRepository.count())
                .totalCategories(categoryRepository.count())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Admin statistics fetched successfully", stats));
    }

    // 2. User Management
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<ProfileDto>>> getAdminUsers(
            @RequestParam(name = "userId", required = false) UUID userId,
            @RequestParam(name = "role", defaultValue = "ALL") String role,
            @RequestParam(name = "query", defaultValue = "") String query,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        verifyAdminRole(userId);

        Page<Profile> userPage = profileRepository.findAdminUsers(role, query, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        List<ProfileDto> dtos = userPage.getContent().stream().map(p -> ProfileDto.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .fullName(p.getFullName())
                .email(p.getEmail())
                .avatarUrl(p.getAvatarUrl())
                .bio(p.getBio())
                .role(p.getRole())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build()).collect(Collectors.toList());

        PageResponse<ProfileDto> response = PageResponse.<ProfileDto>builder()
                .content(dtos)
                .pageNo(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", response));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<ProfileDto>> updateUserRole(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody RoleUpdateRequest request) {
        verifyAdminRole(userId);

        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found with id: " + id));

        profile.setRole(request.getRole());
        Profile updated = profileRepository.save(profile);

        ProfileDto dto = ProfileDto.builder()
                .id(updated.getId())
                .userId(updated.getUserId())
                .fullName(updated.getFullName())
                .email(updated.getEmail())
                .role(updated.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", dto));
    }

    // 3. Blog Management
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<BlogDto>>> getAdminBlogs(
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);

        List<BlogDto> blogs = blogRepository.findAll()
                .stream()
                .map(b -> BlogDto.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .slug(b.getSlug())
                        .status(b.getStatus())
                        .authorName(b.getAuthor() != null ? b.getAuthor().getFullName() : "Anonymous")
                        .createdAt(b.getCreatedAt())
                        .publishedAt(b.getPublishedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Admin blogs fetched successfully", blogs));
    }

    @DELETE
    @RequestMapping(value = "/blogs/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<ApiResponse<Void>> deleteBlogByAdmin(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);

        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted by administrator", null));
    }

    // 4. Category Administration
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAdminCategories(
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);

        List<CategoryDto> categories = categoryRepository.findAll().stream()
                .map(c -> CategoryDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .slug(c.getSlug())
                        .description(c.getDescription())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categories));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody CategoryDto dto) {
        verifyAdminRole(userId);

        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .build();

        Category saved = categoryRepository.save(category);
        CategoryDto result = CategoryDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .slug(saved.getSlug())
                .description(saved.getDescription())
                .createdAt(saved.getCreatedAt())
                .build();

        return new ResponseEntity<>(ApiResponse.success("Category created successfully", result), HttpStatus.CREATED);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);

        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // 5. Comment Moderation
    @GetMapping("/comments")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getAdminComments(
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);
        List<CommentDto> comments = commentService.getAllCommentsForAdmin();
        return ResponseEntity.ok(ApiResponse.success("Admin comments fetched successfully", comments));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCommentByAdmin(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId) {
        verifyAdminRole(userId);
        commentService.deleteComment(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment moderated and removed", null));
    }
}
