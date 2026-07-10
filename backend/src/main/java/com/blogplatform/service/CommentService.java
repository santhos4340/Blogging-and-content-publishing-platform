package com.blogplatform.service;

import com.blogplatform.dto.CommentDto;
import com.blogplatform.entity.Blog;
import com.blogplatform.entity.Comment;
import com.blogplatform.entity.Profile;
import com.blogplatform.exception.ForbiddenException;
import com.blogplatform.exception.ResourceNotFoundException;
import com.blogplatform.repository.BlogRepository;
import com.blogplatform.repository.CommentRepository;
import com.blogplatform.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByBlogId(UUID blogId) {
        return commentRepository.findByBlogIdOrderByCreatedAtDesc(blogId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto addComment(UUID blogId, CommentDto dto, UUID authenticatedUserId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog article not found with id: " + blogId));

        if (!"PUBLISHED".equals(blog.getStatus())) {
            throw new ForbiddenException("Comments cannot be added to unpublished blogs.");
        }

        Profile user = profileRepository.findByUserId(authenticatedUserId)
                .orElseGet(() -> profileRepository.findAll().stream().findFirst().orElse(null));

        Comment comment = Comment.builder()
                .blog(blog)
                .user(user)
                .content(dto.getContent())
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    @Transactional
    public CommentDto updateComment(UUID commentId, String content, UUID authenticatedUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Ownership check
        if (comment.getUser() != null && !comment.getUser().getUserId().equals(authenticatedUserId)) {
            Profile caller = profileRepository.findByUserId(authenticatedUserId).orElse(null);
            if (caller == null || !"ADMIN".equals(caller.getRole())) {
                throw new ForbiddenException("Unauthorized: You do not have permission to edit this comment.");
            }
        }

        comment.setContent(content);
        Comment updated = commentRepository.save(comment);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID authenticatedUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Ownership or Admin check
        if (comment.getUser() != null && !comment.getUser().getUserId().equals(authenticatedUserId)) {
            Profile caller = profileRepository.findByUserId(authenticatedUserId).orElse(null);
            if (caller == null || !"ADMIN".equals(caller.getRole())) {
                throw new ForbiddenException("Unauthorized: You do not have permission to delete this comment.");
            }
        }

        commentRepository.deleteById(commentId);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getAllCommentsForAdmin() {
        return commentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CommentDto mapToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .blogId(comment.getBlog().getId())
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .userName(comment.getUser() != null ? comment.getUser().getFullName() : "Guest")
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
