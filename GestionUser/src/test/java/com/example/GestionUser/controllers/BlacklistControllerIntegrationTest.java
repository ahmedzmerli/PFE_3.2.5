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
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
////@ActiveProfiles("test")
//class BlacklistControllerIntegrationTest {
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
//    @BeforeEach
//    void setUp() {
//        repository.deleteAll();
//    }
//
//    @Test
//    void getAll_shouldReturnEmptyListInitially() throws Exception {
//        mockMvc.perform(get("/api/v1/blacklist")
//                        .with(user("admin").authorities(() -> "blacklist.read")))
//                .andExpect(status().isOk())
//                .andExpect(content().json("[]"));
//    }
//
//    @Test
//    void toggleStatus_shouldToggleBlacklist() throws Exception {
//        BlHistory entity = BlHistory.builder()
//                .msisdn("777")
//                .statutBl("BLACKLISTED")
//                .dateDebut(LocalDateTime.now().minusDays(5))
//                .dateFin(LocalDateTime.now().plusDays(5))
//                .build();
//        entity = repository.save(entity);
//
//        mockMvc.perform(post("/api/v1/blacklist/toggle/{id}", entity.getId())
//                        .with(user("admin").authorities(() -> "blacklist.toggle.create")))
//                .andExpect(status().isOk());
//
//        assertThat(repository.findAll()).hasSize(2);
//        assertThat(repository.findAll()).anyMatch(e -> "WHITELISTED".equalsIgnoreCase(e.getStatutBl()));
//    }
//
//    @Test
//    void toggleStatus_shouldReturn404IfNotFound() throws Exception {
//        mockMvc.perform(post("/api/v1/blacklist/toggle/{id}", 999L)
//                        .with(user("admin").authorities(() -> "blacklist.toggle.create")))
//                .andExpect(status().isNotFound());
//    }
//}
