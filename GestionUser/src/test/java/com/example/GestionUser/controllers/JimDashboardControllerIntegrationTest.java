//package com.example.GestionUser.controllers;
//
//import com.example.GestionUser.entities.jim.JimDashboard;
//import com.example.GestionUser.repositories.jim.JimDashboardRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@Transactional
//class JimDashboardControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private JimDashboardRepository repository;c
//
//    @BeforeEach
//    void setUp() {
//        repository.deleteAll();
//
//        repository.save(
//                JimDashboard.builder()
//                        .CALLID("call-123")
//                        .CONNID("conn-456")
//                        .AGENT("agent1")
//                        .DEBUT_APPEL(LocalDateTime.of(2023, 7, 1, 10, 0))
//                        .FIN_APPEL(LocalDateTime.of(2023, 7, 1, 10, 30))
//                        .HOTLINE("hotline1")
//                        .NUM_CLIENT("123456")
//                        .TIME_IN_QUEUE("00:02:30")
//                        .FILE_ATT("att1")
//                        .DATE_HEURS(LocalDateTime.of(2023, 7, 1, 10, 0))
//                        .STATUS("COMPLETED")
//                        .SEGMENT("SEGMENT_A")
//                        .build()
//        );
//    }
//
//    @Test
//    void searchDashboard_shouldReturnResults() throws Exception {
//        mockMvc.perform(get("/api/v1/dashboard")
//                        .param("msisdn", "123456")
//                        .param("hotline", "hotline1")
//                        .with(user("testuser").authorities(new SimpleGrantedAuthority("dashboard.read")))
//                        .with(csrf())
//                )
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].CALLID").value("call-123"))
//                .andExpect(jsonPath("$[0].NUM_CLIENT").value("123456"));
//    }
//
//    @Test
//    void searchDashboard_shouldReturnBadRequest_whenMsisdnMissing() throws Exception {
//        mockMvc.perform(get("/api/v1/dashboard")
//                        .param("hotline", "hotline1")
//                        .with(user("testuser").authorities(new SimpleGrantedAuthority("dashboard.read")))
//                        .with(csrf())
//                )
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    void searchDashboard_shouldReturnBadRequest_whenHotlineMissing() throws Exception {
//        mockMvc.perform(get("/api/v1/dashboard")
//                        .param("msisdn", "123456")
//                        .with(user("testuser").authorities(new SimpleGrantedAuthority("dashboard.read")))
//                        .with(csrf())
//                )
//                .andExpect(status().isBadRequest());
//    }
//
//}
