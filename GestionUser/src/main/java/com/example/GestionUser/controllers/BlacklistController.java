package com.example.GestionUser.controllers;




import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.GestionUser.dto.BlacklistDTO;
import com.example.GestionUser.services.BlacklistService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blacklist")
@RequiredArgsConstructor
public class BlacklistController {

    private final BlacklistService service;

    @GetMapping
    @PreAuthorize("hasAuthority('blacklist.read')")
    public List<BlacklistDTO> getAll() {
        return service.getAll();
    }

    @PostMapping("/toggle/{id}")
    @PreAuthorize("hasAuthority('blacklist.toggle.create')")
    public void toggleStatus(@PathVariable Long id) {
        service.toggleBlacklist(id);
    }
}
