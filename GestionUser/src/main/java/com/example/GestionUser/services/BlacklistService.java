package com.example.GestionUser.services;




import com.example.GestionUser.handler.ApiException;
import com.example.GestionUser.handler.BusinessErrorCodes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.GestionUser.dto.BlacklistDTO;
import com.example.GestionUser.entities.BlHistory;
import com.example.GestionUser.repositories.BlHistoryRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlacklistService {
    private final BlHistoryRepository repository;

    public List<BlacklistDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

//    public void toggleBlacklist(Long id) {
//        BlHistory record = repository.findById(id).orElseThrow();
//        record.setStatutBl(record.getStatutBl().equalsIgnoreCase("BLACKLISTED") ? "WHITELISTED" : "BLACKLISTED");
//        record.setDateAction(java.time.LocalDateTime.now());
//        repository.save(record);
//    }

    public void toggleBlacklist(Long id) {
        BlHistory previous = repository.findById(id)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.BLACKLIST_ENTRY_NOT_FOUND));

        String currentStatut = previous.getStatutBl();
        String newStatut = (currentStatut != null && currentStatut.equalsIgnoreCase("BLACKLISTED"))
                ? "WHITELISTED"
                : "BLACKLISTED";

        BlHistory newEntry = BlHistory.builder()
                .msisdn(previous.getMsisdn())
                .username(previous.getUsername())
                .motif(previous.getMotif())
                .statutBl(newStatut)
                .offre(previous.getOffre())
                .segment(previous.getSegment())
                .tmcode(previous.getTmcode())
                .typeClient(previous.getTypeClient())
                .dateDebut(LocalDateTime.now())  // ou copier de previous
                .dateFin(LocalDateTime.now().plusDays(30)) // exemple
                .dateAction(LocalDateTime.now())
                .dateLastBlacklist(previous.getDateLastBlacklist())
                .typeBlack(previous.getTypeBlack())
                .hourBl(LocalDateTime.now().toLocalTime().toString())
                .build();

        repository.save(newEntry);
    }



    private BlacklistDTO toDTO(BlHistory b) {
        long duree = java.time.temporal.ChronoUnit.DAYS.between(b.getDateDebut(), b.getDateFin());
        return BlacklistDTO.builder()
                .id(b.getId())
                .msisdn(b.getMsisdn())
                .segment(b.getSegment())
                .dateDebut(b.getDateDebut())
                .dateFin(b.getDateFin())
                .motif(b.getMotif())
                .offre(b.getOffre())
                .statut(b.getStatutBl())
                .username(b.getUsername())
                .typeClient(b.getTypeClient())
                .dureeBlacklist(duree)
                .dateAction(b.getDateAction())
                .build();
    }
}
