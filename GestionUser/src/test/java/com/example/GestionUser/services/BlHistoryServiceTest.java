package com.example.GestionUser.services;

import com.example.GestionUser.dto.BlHistoryDTO;
import com.example.GestionUser.entities.BlHistory;
import com.example.GestionUser.repositories.BlHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.Mockito.*;
//@SpringBootTest
//@ActiveProfiles("test")
class BlHistoryServiceTest {

    private BlHistoryRepository repository;
    private BlHistoryService service;

    @BeforeEach
    void setUp() {
        repository = mock(BlHistoryRepository.class);
        service = new BlHistoryService(repository);
    }

    @Test
    void shouldUseProvidedDatesWhenBothDatesAreGiven() {
        // Arrange
        String msisdn = "12345678";
        LocalDateTime start = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2023, 1, 31, 23, 59);

        BlHistory entity = createEntity(msisdn, start.plusDays(1));
        when(repository.searchHistory(msisdn, start, end)).thenReturn(List.of(entity));

        // Act
        List<BlHistoryDTO> result = service.search(msisdn, start, end);

        // Assert
        assertThat(result).hasSize(1);
        BlHistoryDTO dto = result.get(0);
        assertThat(dto.getMsisdn()).isEqualTo(msisdn);
        assertThat(dto.getDateAction()).isEqualTo(entity.getDateAction());

        verify(repository).searchHistory(msisdn, start, end);
    }

    @Test
    void shouldUseLast30DaysWhenDatesAreNull() {
        // Arrange
        String msisdn = "98765432";

        LocalDateTime now = LocalDateTime.now();
        BlHistory entity = createEntity(msisdn, now.minusDays(5));
        when(repository.searchHistory(eq(msisdn), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(entity));

        // Act
        List<BlHistoryDTO> result = service.search(msisdn, null, null);

        // Assert
        assertThat(result).hasSize(1);

        ArgumentCaptor<LocalDateTime> startCaptor = ArgumentCaptor.forClass(LocalDateTime.class);
        ArgumentCaptor<LocalDateTime> endCaptor = ArgumentCaptor.forClass(LocalDateTime.class);

        verify(repository).searchHistory(eq(msisdn), startCaptor.capture(), endCaptor.capture());

        LocalDateTime startUsed = startCaptor.getValue();
        LocalDateTime endUsed = endCaptor.getValue();

        assertThat(endUsed).isAfter(startUsed);
        assertThat(endUsed).isCloseTo(now, within(5, ChronoUnit.SECONDS));
        assertThat(startUsed).isCloseTo(now.minusDays(30), within(5, ChronoUnit.SECONDS));
    }

    private BlHistory createEntity(String msisdn, LocalDateTime dateAction) {
        BlHistory b = new BlHistory();
        b.setMsisdn(msisdn);
        b.setUsername("user1");
        b.setMotif("motif");
        b.setStatutBl("BLACKLISTED");
        b.setOffre("offre");
        b.setSegment("segment");
        b.setTypeClient("typeClient");
        b.setDateAction(dateAction);
        b.setDateDebut(dateAction.minusDays(1));
        b.setDateFin(dateAction.plusDays(1));
        b.setTypeBlack("typeBlack");
        return b;
    }
}
