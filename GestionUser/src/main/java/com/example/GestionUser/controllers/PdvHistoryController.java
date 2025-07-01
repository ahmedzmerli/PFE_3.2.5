package com.example.GestionUser.controllers;

import com.example.GestionUser.dto.PdvHistoryDTO;
import com.example.GestionUser.entities.PdvHistory;
import com.example.GestionUser.repositories.PdvHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pdv-history")
@RequiredArgsConstructor
public class PdvHistoryController {

    private final PdvHistoryRepository historyRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('pdvhistory.read')")
    public List<PdvHistoryDTO> getAll() {
        return historyRepository.findAll().stream().map(p ->
                PdvHistoryDTO.builder()
                        .msisdn(p.getMsisdn())
                        .nomPdv(p.getNomPdv())
                        .adresse(p.getAdresse())
                        .codePdv(p.getCodePdv())
                        .username(p.getUsername())
                        .actionType(p.getActionType())
                        .dateAction(p.getDateAction())
                        .build()
        ).collect(Collectors.toList());
    }
}
