package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.services.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
// @PreAuthorize("hasAuthority('admin.permission')") // à adapter
public class PermissionController {
    private final PermissionService service;

    
    @GetMapping
    public List<Permission> list() {
        return service.listAll();
    }

    @GetMapping("/distinct")
    public Map<String, List<String>> getDistinctFeaturesAndActions() {
        return service.getDistinctFeaturesAndActions();

    }
}
