package com.example.GestionUser.services;

import com.example.GestionUser.dto.BlacklistDTO;
import com.example.GestionUser.entities.BlHistory;
import com.example.GestionUser.handler.ApiException;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.repositories.BlHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
//@SpringBootTest
//@ActiveProfiles("test")

class BlacklistServiceTest {

    private BlHistoryRepository repository;
    private BlacklistService service;

    @BeforeEach
    void setUp() {
        repository = mock(BlHistoryRepository.class);
        service = new BlacklistService(repository);
    }

    @Test
    void getAll_shouldReturnMappedDTOs() {
        BlHistory entity = BlHistory.builder()
                .id(1L)
                .msisdn("12345")
                .segment("VIP")
                .dateDebut(LocalDateTime.now().minusDays(10))
                .dateFin(LocalDateTime.now().plusDays(10))
                .motif("Fraud")
                .offre("Pack")
                .statutBl("BLACKLISTED")
                .username("admin")
                .typeClient("Gold")
                .dateAction(LocalDateTime.now())
                .build();

        when(repository.findAll()).thenReturn(List.of(entity));

        List<BlacklistDTO> result = service.getAll();

        assertThat(result).hasSize(1);
        BlacklistDTO dto = result.get(0);
        assertThat(dto.getMsisdn()).isEqualTo("12345");
        assertThat(dto.getDureeBlacklist()).isEqualTo(20);
    }

    @Test
    void toggleBlacklist_shouldToggleFromBlacklistedToWhitelisted() {
        BlHistory entity = BlHistory.builder()
                .id(1L)
                .msisdn("555")
                .statutBl("BLACKLISTED")
                .dateDebut(LocalDateTime.now().minusDays(5))
                .dateFin(LocalDateTime.now().plusDays(5))
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        service.toggleBlacklist(1L);

        verify(repository).save(argThat(newEntry ->
                newEntry.getMsisdn().equals("555") &&
                        newEntry.getStatutBl().equalsIgnoreCase("WHITELISTED") &&
                        newEntry.getDateDebut() != null &&
                        newEntry.getDateFin() != null
        ));
    }

    @Test
    void toggleBlacklist_shouldThrowIfNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.toggleBlacklist(1L))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException apiEx = (ApiException) ex;
                    assertThat(apiEx.getCode()).isEqualTo(BusinessErrorCodes.BLACKLIST_ENTRY_NOT_FOUND.getCode());
                });
    }

}
