package com.example.GestionUser.controllers;

import com.example.GestionUser.dto.PdvDTO;
import com.example.GestionUser.services.PdvService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pdv")
@RequiredArgsConstructor
public class PdvController {

    private final PdvService service;

    @PostMapping
    @PreAuthorize("hasAuthority('pdv.create')")
    public void create(@RequestBody PdvDTO dto, Principal connectedUser) {
        service.addPdv(dto, connectedUser.getName());
    }

    @DeleteMapping("/{msisdn}")
    @PreAuthorize("hasAuthority('pdv.delete')")
    public void delete(@PathVariable String msisdn, Principal connectedUser) {
        service.deletePdv(msisdn, connectedUser.getName());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('pdv.read')")
    public List<PdvDTO> listAll() {
        return service.listAll();
    }
}
