package com.blogplatform.service;

import com.blogplatform.dto.BlogDto;
import com.blogplatform.dto.PageResponse;
import com.blogplatform.entity.Blog;
import com.blogplatform.entity.Profile;
import com.blogplatform.exception.ForbiddenException;
import com.blogplatform.exception.ResourceNotFoundException;
import com.blogplatform.repository.BlogRepository;
import com.blogplatform.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public PageResponse<BlogDto> getPublishedBlogsPaginated(Pageable pageable) {
        Page<Blog> page = blogRepository.findByStatus("PUBLISHED", pageable);
        List<BlogDto> dtos = page.getContent().stream().map(this::mapToDto).collect(Collectors.toList());

        return PageResponse.<BlogDto>builder()
                .content(dtos)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<BlogDto> searchPublishedBlogs(String query, Pageable pageable) {
        Page<Blog> page = blogRepository.searchPublishedBlogs(query, pageable);
        List<BlogDto> dtos = page.getContent().stream().map(this::mapToDto).collect(Collectors.toList());

        return PageResponse.<BlogDto>builder()
                .content(dtos)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public BlogDto getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugAndStatus(slug, "PUBLISHED")
                .orElseThrow(() -> new ResourceNotFoundException("Published blog not found with slug: " + slug));
        return mapToDto(blog);
    }

    @Transactional(readOnly = true)
    public BlogDto getBlogById(UUID id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog article not found with id: " + id));
        return mapToDto(blog);
    }

    @Transactional(readOnly = true)
    public List<BlogDto> getUserBlogs(UUID authorId, String status, String query) {
        return blogRepository.findUserBlogsFiltered(authorId, status, query)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BlogDto createBlog(BlogDto dto, UUID authenticatedUserId) {
        Profile author = profileRepository.findByUserId(authenticatedUserId)
                .orElseGet(() -> profileRepository.findAll().stream().findFirst().orElse(null));

        String slug = dto.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]", "-");
        }

        Blog blog = Blog.builder()
                .title(dto.getTitle())
                .slug(slug)
                .content(dto.getContent())
                .excerpt(dto.getExcerpt())
                .featuredImage(dto.getFeaturedImage())
                .status(dto.getStatus() != null ? dto.getStatus() : "DRAFT")
                .author(author)
                .publishedAt("PUBLISHED".equals(dto.getStatus()) ? LocalDateTime.now() : null)
                .build();

        Blog saved = blogRepository.save(blog);
        return mapToDto(saved);
    }

    @Transactional
    public BlogDto updateBlog(UUID id, BlogDto dto, UUID authenticatedUserId) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog article not found with id: " + id));

        // Ownership Verification
        if (blog.getAuthor() != null && !blog.getAuthor().getUserId().equals(authenticatedUserId)) {
            throw new ForbiddenException("Unauthorized: You do not have permission to edit this blog post.");
        }

        blog.setTitle(dto.getTitle());
        if (dto.getSlug() != null && !dto.getSlug().isBlank()) {
            blog.setSlug(dto.getSlug());
        }
        blog.setContent(dto.getContent());
        blog.setExcerpt(dto.getExcerpt());
        if (dto.getFeaturedImage() != null) blog.setFeaturedImage(dto.getFeaturedImage());

        if (dto.getStatus() != null) {
            if ("PUBLISHED".equals(dto.getStatus()) && !"PUBLISHED".equals(blog.getStatus())) {
                blog.setPublishedAt(LocalDateTime.now());
            }
            blog.setStatus(dto.getStatus());
        }

        Blog updated = blogRepository.save(blog);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteBlog(UUID id, UUID authenticatedUserId) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog article not found with id: " + id));

        // Ownership Verification
        if (blog.getAuthor() != null && !blog.getAuthor().getUserId().equals(authenticatedUserId)) {
            throw new ForbiddenException("Unauthorized: You do not have permission to delete this blog post.");
        }

        blogRepository.deleteById(id);
    }

    private BlogDto mapToDto(Blog blog) {
        return BlogDto.builder()
                .id(blog.getId())
                .authorId(blog.getAuthor() != null ? blog.getAuthor().getId() : null)
                .authorName(blog.getAuthor() != null ? blog.getAuthor().getFullName() : "Anonymous")
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .content(blog.getContent())
                .excerpt(blog.getExcerpt())
                .featuredImage(blog.getFeaturedImage())
                .status(blog.getStatus())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .publishedAt(blog.getPublishedAt())
                .build();
    }
}
