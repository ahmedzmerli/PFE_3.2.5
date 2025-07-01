package com.example.GestionUser.services;

import com.example.GestionUser.dto.PdvDTO;
import com.example.GestionUser.entities.Pdv;
import com.example.GestionUser.entities.PdvHistory;
import com.example.GestionUser.entities.PdvMaster;
import com.example.GestionUser.repositories.PdvHistoryRepository;
import com.example.GestionUser.repositories.PdvMasterRepository;
import com.example.GestionUser.repositories.PdvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PdvService {

    private final PdvRepository pdvRepository;
    private final PdvMasterRepository pdvMasterRepository;
    private final PdvHistoryRepository pdvHistoryRepository;

    public void addPdv(PdvDTO dto, String username) {
        // Si le msisdn existe déjà dans l'ancienne table, on ne fait rien
        if (pdvRepository.existsById(dto.getMsisdn())) {
            throw new IllegalStateException("PDV déjà existant");
        }

        // Ajouter dans l'ancienne table
        pdvRepository.save(new Pdv(dto.getMsisdn()));

        // Ajouter dans la nouvelle table
        pdvMasterRepository.save(
                PdvMaster.builder()
                        .msisdn(dto.getMsisdn())
                        .nomPdv(dto.getNomPdv())
                        .adresse(dto.getAdresse())
                        .codePdv(dto.getCodePdv())
                        .latitude(dto.getLatitude())
                        .longitude(dto.getLongitude())
                        .build()
        );


        // Sauvegarder dans l’historique
        pdvHistoryRepository.save(
                PdvHistory.builder()
                        .msisdn(dto.getMsisdn())
                        .nomPdv(dto.getNomPdv())
                        .adresse(dto.getAdresse())
                        .codePdv(dto.getCodePdv())
                        .username(username)
                        .actionType("CREATE")
                        .dateAction(LocalDateTime.now())
                        .build()
        );
    }

    public void deletePdv(String msisdn, String username) {
        // Supprimer de pdv_master
        pdvMasterRepository.deleteById(msisdn);

        // Supprimer de la table legacy
        pdvRepository.deleteById(msisdn);

        // Historiser
        pdvHistoryRepository.save(
                PdvHistory.builder()
                        .msisdn(msisdn)
                        .username(username)
                        .actionType("DELETE")
                        .dateAction(LocalDateTime.now())
                        .build()
        );
    }

    public List<PdvDTO> listAll() {
        return pdvMasterRepository.findAll().stream().map(p ->
                PdvDTO.builder()
                        .msisdn(p.getMsisdn())
                        .nomPdv(p.getNomPdv())
                        .adresse(p.getAdresse())
                        .codePdv(p.getCodePdv())
                        .latitude(p.getLatitude())
                        .longitude(p.getLongitude())
                        .build()
        ).collect(Collectors.toList());
    }
}
