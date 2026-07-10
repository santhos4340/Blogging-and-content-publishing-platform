package com.blogplatform.repository;

import com.blogplatform.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByBlogIdOrderByCreatedAtDesc(UUID blogId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.blog.author.id = :authorId")
    long countCommentsByAuthorId(@Param("authorId") UUID authorId);
}
