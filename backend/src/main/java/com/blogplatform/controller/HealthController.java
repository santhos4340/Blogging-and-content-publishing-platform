package com.blogplatform.controller;

import com.blogplatform.dto.HealthResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponseDto> getHealthStatus() {
        HealthResponseDto health = new HealthResponseDto(
                "UP",
                "Blogging Content Publishing Platform API is running"
        );
        return ResponseEntity.ok(health);
    }
}
