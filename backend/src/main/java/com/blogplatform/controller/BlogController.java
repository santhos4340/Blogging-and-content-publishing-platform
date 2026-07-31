package com.blogplatform.controller;

import com.blogplatform.dto.ApiResponse;
import com.blogplatform.dto.BlogDto;
import com.blogplatform.dto.PageResponse;
import com.blogplatform.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BlogDto>>> getPublishedBlogs(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        PageResponse<BlogDto> response = blogService.getPublishedBlogsPaginated(pageable);
        return ResponseEntity.ok(ApiResponse.success("Published blogs fetched successfully", response));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogDto>> getBlogBySlug(@PathVariable("slug") String slug) {
        BlogDto blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Blog details fetched successfully", blog));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<BlogDto>>> searchPublishedBlogs(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        PageResponse<BlogDto> response = blogService.searchPublishedBlogs(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> getBlogById(@PathVariable("id") UUID id) {
        BlogDto blog = blogService.getBlogById(id);
        return ResponseEntity.ok(ApiResponse.success("Blog details fetched successfully", blog));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogDto>> createBlog(
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody BlogDto blogDto) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        BlogDto created = blogService.createBlog(blogDto, authUserId);
        return new ResponseEntity<>(ApiResponse.success("Blog created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> updateBlog(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody BlogDto blogDto) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        BlogDto updated = blogService.updateBlog(id, blogDto, authUserId);
        return ResponseEntity.ok(ApiResponse.success("Blog updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @PathVariable("id") UUID id,
            @RequestParam(name = "userId", required = false) UUID userId) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        blogService.deleteBlog(id, authUserId);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully", null));
    }
}
