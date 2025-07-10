package com.example.GestionUser.services;

import com.example.GestionUser.dto.PdvDTO;
import com.example.GestionUser.entities.Pdv;
import com.example.GestionUser.entities.PdvHistory;
import com.example.GestionUser.entities.PdvMaster;
import com.example.GestionUser.repositories.PdvHistoryRepository;
import com.example.GestionUser.repositories.PdvMasterRepository;
import com.example.GestionUser.repositories.PdvRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class PdvServiceTest {

    private PdvRepository pdvRepository;
    private PdvMasterRepository pdvMasterRepository;
    private PdvHistoryRepository pdvHistoryRepository;
    private PdvService service;

    @BeforeEach
    void setUp() {
        pdvRepository = mock(PdvRepository.class);
        pdvMasterRepository = mock(PdvMasterRepository.class);
        pdvHistoryRepository = mock(PdvHistoryRepository.class);
        service = new PdvService(pdvRepository, pdvMasterRepository, pdvHistoryRepository);
    }

    @Test
    void addPdv_shouldSaveToAllRepositories() {
        PdvDTO dto = PdvDTO.builder()
                .msisdn("123")
                .nomPdv("PDV Test")
                .adresse("Adresse")
                .codePdv("CODE1")
                .latitude(Double.valueOf("36.8"))
                .longitude(Double.valueOf("10.2"))
                .build();

        when(pdvRepository.existsById("123")).thenReturn(false);

        service.addPdv(dto, "admin");

        verify(pdvRepository).save(any(Pdv.class));
        verify(pdvMasterRepository).save(any(PdvMaster.class));
        verify(pdvHistoryRepository).save(argThat(h ->
                h.getMsisdn().equals("123") &&
                        h.getActionType().equals("CREATE") &&
                        h.getUsername().equals("admin")
        ));
    }

    @Test
    void addPdv_shouldThrowIfAlreadyExists() {
        when(pdvRepository.existsById("123")).thenReturn(true);

        PdvDTO dto = PdvDTO.builder().msisdn("123").build();

        assertThatThrownBy(() -> service.addPdv(dto, "user"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("PDV déjà existant");
    }

    @Test
    void deletePdv_shouldDeleteAndLog() {
        service.deletePdv("123", "deleter");

        verify(pdvRepository).deleteById("123");
        verify(pdvMasterRepository).deleteById("123");
        verify(pdvHistoryRepository).save(argThat(h ->
                h.getMsisdn().equals("123") &&
                        h.getActionType().equals("DELETE") &&
                        h.getUsername().equals("deleter")
        ));
    }

    @Test
    void listAll_shouldReturnDTOs() {
        PdvMaster p = PdvMaster.builder()
                .msisdn("456")
                .nomPdv("PDV")
                .adresse("Adresse")
                .codePdv("CODE")
                .latitude(Double.valueOf("36.7"))
                .longitude(Double.valueOf("10.1"))
                .build();

        when(pdvMasterRepository.findAll()).thenReturn(List.of(p));

        List<PdvDTO> dtos = service.listAll();

        assertThat(dtos).hasSize(1);
        assertThat(dtos.get(0).getMsisdn()).isEqualTo("456");
    }
}
