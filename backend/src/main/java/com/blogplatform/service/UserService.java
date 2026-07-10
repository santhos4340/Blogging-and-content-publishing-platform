package com.blogplatform.service;

import com.blogplatform.dto.ProfileDto;
import com.blogplatform.dto.UserStatsDto;
import com.blogplatform.entity.Profile;
import com.blogplatform.exception.ResourceNotFoundException;
import com.blogplatform.repository.BlogRepository;
import com.blogplatform.repository.CommentRepository;
import com.blogplatform.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ProfileRepository profileRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public ProfileDto getProfileByUserId(UUID userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> profileRepository.findAll().stream().findFirst()
                        .orElse(Profile.builder()
                                .id(UUID.randomUUID())
                                .userId(userId)
                                .fullName("Default Author")
                                .email("author@example.com")
                                .bio("Author Bio")
                                .build()));

        return mapToDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(UUID userId, ProfileDto dto) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> Profile.builder().userId(userId).email(dto.getEmail()).build());

        profile.setFullName(dto.getFullName());
        if (dto.getAvatarUrl() != null) profile.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getBio() != null) profile.setBio(dto.getBio());

        Profile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public UserStatsDto getUserStats(UUID userId) {
        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            return UserStatsDto.builder()
                    .totalBlogs(0)
                    .publishedBlogs(0)
                    .draftBlogs(0)
                    .totalComments(0)
                    .build();
        }

        UUID authorId = profile.getId();
        long total = blogRepository.countByAuthorId(authorId);
        long published = blogRepository.countByAuthorIdAndStatus(authorId, "PUBLISHED");
        long drafts = blogRepository.countByAuthorIdAndStatus(authorId, "DRAFT");
        long comments = commentRepository.countCommentsByAuthorId(authorId);

        return UserStatsDto.builder()
                .totalBlogs(total)
                .publishedBlogs(published)
                .draftBlogs(drafts)
                .totalComments(comments)
                .build();
    }

    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .avatarUrl(profile.getAvatarUrl())
                .bio(profile.getBio())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
