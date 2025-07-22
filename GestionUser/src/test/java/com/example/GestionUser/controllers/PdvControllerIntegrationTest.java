//package com.example.GestionUser.controllers;
//
//import com.example.GestionUser.dto.PdvDTO;
//import com.example.GestionUser.entities.Pdv;
//import com.example.GestionUser.entities.PdvMaster;
//import com.example.GestionUser.repositories.PdvHistoryRepository;
//import com.example.GestionUser.repositories.PdvMasterRepository;
//import com.example.GestionUser.repositories.PdvRepository;
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
//import java.security.Principal;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test")
//class PdvControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Autowired
//    private PdvRepository pdvRepository;
//
//    @Autowired
//    private PdvMasterRepository pdvMasterRepository;
//
//    @Autowired
//    private PdvHistoryRepository pdvHistoryRepository;
//
//    @BeforeEach
//    void cleanDb() {
//        pdvHistoryRepository.deleteAll();
//        pdvMasterRepository.deleteAll();
//        pdvRepository.deleteAll();
//    }
//
//    @Test
//    void create_shouldAddPdv() throws Exception {
//        PdvDTO dto = PdvDTO.builder()
//                .msisdn("999")
//                .nomPdv("PDV Test")
//                .adresse("Rue")
//                .codePdv("C123")
//                .latitude(Double.valueOf("36.8"))
//                .longitude(Double.valueOf("10.2"))
//                .build();
//
//        mockMvc.perform(post("/api/v1/pdv")
//                        .with(user("test").authorities(() -> "pdv.create"))
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk());
//
//        assertThat(pdvMasterRepository.findById("999")).isPresent();
//        assertThat(pdvHistoryRepository.findAll()).anyMatch(h -> h.getActionType().equals("CREATE"));
//    }
//
//    @Test
//    void listAll_shouldReturnAllPdv() throws Exception {
//        pdvMasterRepository.save(PdvMaster.builder()
//                .msisdn("1000")
//                .nomPdv("PDV Sample")
//                .build());
//
//        mockMvc.perform(get("/api/v1/pdv")
//                        .with(user("test").authorities(() -> "pdv.read")))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].msisdn").value("1000"));
//    }
//
//    @Test
//    void delete_shouldRemovePdv() throws Exception {
//        pdvMasterRepository.save(PdvMaster.builder().msisdn("2000").build());
//        pdvRepository.save(new Pdv("2000"));
//
//        mockMvc.perform(delete("/api/v1/pdv/{msisdn}", "2000")
//                        .with(user("deleter").authorities(() -> "pdv.delete")))
//                .andExpect(status().isOk());
//
//        assertThat(pdvMasterRepository.findById("2000")).isEmpty();
//        assertThat(pdvRepository.findById("2000")).isEmpty();
//        assertThat(pdvHistoryRepository.findAll()).anyMatch(h -> h.getActionType().equals("DELETE"));
//    }
//}
