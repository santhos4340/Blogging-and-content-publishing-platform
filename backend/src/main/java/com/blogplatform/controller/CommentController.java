package com.blogplatform.controller;

import com.blogplatform.dto.ApiResponse;
import com.blogplatform.dto.CommentDto;
import com.blogplatform.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/blogs/{blogId}/comments")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getCommentsByBlog(@PathVariable("blogId") UUID blogId) {
        List<CommentDto> comments = commentService.getCommentsByBlogId(blogId);
        return ResponseEntity.ok(ApiResponse.success("Comments fetched successfully", comments));
    }

    @PostMapping("/blogs/{blogId}/comments")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable("blogId") UUID blogId,
            @RequestParam(name = "userId", required = false) UUID userId,
            @Valid @RequestBody CommentDto commentDto) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        CommentDto created = commentService.addComment(blogId, commentDto, authUserId);
        return new ResponseEntity<>(ApiResponse.success("Comment posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(
            @PathVariable("id") UUID commentId,
            @RequestParam(name = "userId", required = false) UUID userId,
            @RequestBody CommentDto commentDto) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        CommentDto updated = commentService.updateComment(commentId, commentDto.getContent(), authUserId);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", updated));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable("id") UUID commentId,
            @RequestParam(name = "userId", required = false) UUID userId) {
        UUID authUserId = (userId != null) ? userId : UUID.randomUUID();
        commentService.deleteComment(commentId, authUserId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
