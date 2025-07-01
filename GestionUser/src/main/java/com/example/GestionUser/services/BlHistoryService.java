package com.example.GestionUser.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.GestionUser.dto.BlHistoryDTO;
import com.example.GestionUser.entities.BlHistory;
import com.example.GestionUser.repositories.BlHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class BlHistoryService {

    private final BlHistoryRepository repository;

    public List<BlHistoryDTO> search(String msisdn, LocalDateTime start, LocalDateTime end) {
        LocalDateTime now = LocalDateTime.now();

        if (start == null || end == null) {
            // Si aucune période n’est fournie, on prend les 30 derniers jours
            end = now;
            start = now.minusDays(30);
        }

        return repository.searchHistory(msisdn, start, end)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private BlHistoryDTO toDTO(BlHistory b) {
        return BlHistoryDTO.builder()
                .msisdn(b.getMsisdn())
                .username(b.getUsername())
//                .motif(motif)
                .motif(b.getMotif())
                .statut(b.getStatutBl())
                .offre(b.getOffre())
                .segment(b.getSegment())
                .typeClient(b.getTypeClient())
                .dateAction(b.getDateAction())
                .startDate(b.getDateDebut())
                .endDate(b.getDateFin())
                .typeBlack(b.getTypeBlack())
                .build();
    }
}
