package com.blogplatform.repository;

import com.blogplatform.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByUserId(UUID userId);
    Optional<Profile> findByEmail(String email);

    @Query("SELECT p FROM Profile p WHERE " +
           "(:role IS NULL OR :role = 'ALL' OR p.role = :role) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Profile> findAdminUsers(@Param("role") String role, @Param("query") String query, Pageable pageable);
}
