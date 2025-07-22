//package com.example.GestionUser.controllers;
//
//import com.example.GestionUser.entities.BlHistory;
//import com.example.GestionUser.repositories.BlHistoryRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
//class BlHistoryControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private BlHistoryRepository repository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private BlHistory entity;
//
//    @BeforeEach
//    void setUp() {
//        repository.deleteAll();
//
//        entity = new BlHistory();
//        entity.setMsisdn("12345678");
//        entity.setUsername("john.doe");
//        entity.setMotif("motif test");
//        entity.setStatutBl("BLACKLISTED");
//        entity.setOffre("offre");
//        entity.setSegment("segment");
//        entity.setTypeClient("typeClient");
//        entity.setDateAction(LocalDateTime.now().minusDays(1));
//        entity.setDateDebut(entity.getDateAction().minusDays(1));
//        entity.setDateFin(entity.getDateAction().plusDays(1));
//        entity.setTypeBlack("typeBlack");
//
//        repository.save(entity);
//    }
//
//    @Test
//    void shouldReturnHistoryWhenMsisdnProvidedAndDatesNull() throws Exception {
//        mockMvc.perform(get("/api/v1/blhistory")
//                        .with(user("test").authorities(new SimpleGrantedAuthority("blhistory.read")))
//                        .param("msisdn", entity.getMsisdn()))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].msisdn").value(entity.getMsisdn()))
//                .andExpect(jsonPath("$[0].motif").value(entity.getMotif()));
//    }
//
//    @Test
//    void shouldReturnHistoryWhenDatesProvided() throws Exception {
//        String start = entity.getDateAction().minusDays(2).format(DateTimeFormatter.ISO_DATE_TIME);
//        String end = entity.getDateAction().plusDays(2).format(DateTimeFormatter.ISO_DATE_TIME);
//
//        mockMvc.perform(get("/api/v1/blhistory")
//                        .with(user("test").authorities(new SimpleGrantedAuthority("blhistory.read")))
//                        .param("msisdn", entity.getMsisdn())
//                        .param("start", start)
//                        .param("end", end))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1));
//    }
//
//    @Test
//    void shouldReturnBadRequestWhenMsisdnIsBlank() throws Exception {
//        mockMvc.perform(get("/api/v1/blhistory")
//                        .with(user("test").authorities(new SimpleGrantedAuthority("blhistory.read")))
//                        .param("msisdn", ""))
//                .andExpect(status().isBadRequest())
//                .andExpect(jsonPath("$.businessErrorDescription").value("Le champ MSISDN est requis pour la recherche dans l'historique."));
//    }
//
//    @Test
//    void shouldReturnForbiddenWhenNoAuthority() throws Exception {
//        mockMvc.perform(get("/api/v1/blhistory")
//                        .with(user("test")) // pas d'autorité
//                        .param("msisdn", entity.getMsisdn()))
//                .andExpect(status().isForbidden());
//    }
//}
