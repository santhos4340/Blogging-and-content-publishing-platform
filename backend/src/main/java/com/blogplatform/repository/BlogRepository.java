package com.blogplatform.repository;

import com.blogplatform.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {
    
    Page<Blog> findByStatus(String status, Pageable pageable);
    
    Optional<Blog> findBySlugAndStatus(String slug, String status);
    
    Optional<Blog> findBySlug(String slug);

    List<Blog> findByAuthorId(UUID authorId);

    long countByAuthorId(UUID authorId);

    long countByAuthorIdAndStatus(UUID authorId, String status);

    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.excerpt) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Blog> searchPublishedBlogs(@Param("query") String query, Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.author.id = :authorId AND " +
           "(:status IS NULL OR :status = 'ALL' OR b.status = :status) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Blog> findUserBlogsFiltered(@Param("authorId") UUID authorId, @Param("status") String status, @Param("query") String query);
}
