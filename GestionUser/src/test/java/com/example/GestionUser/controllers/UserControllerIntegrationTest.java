//package com.example.GestionUser.controllers;
//
//import com.example.GestionUser.entities.Role;
//import com.example.GestionUser.entities.User;
//import com.example.GestionUser.repositories.RoleRepository;
//import com.example.GestionUser.repositories.UserRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.HashSet;
//
//import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@Transactional
////@ActiveProfiles("test")
//
//class UserControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    private User user;
//    private Role role;
//
//    @BeforeEach
//    void setUp() {
//        // Nettoyage
//        userRepository.deleteAll();
//        roleRepository.deleteAll();
//
//        // Création d'un rôle
//        role = roleRepository.save(Role.builder()
//                .name("ROLE_TEST")
//                .permissionLists(new java.util.ArrayList<>())
//                .build());
//
//        // Création d'un utilisateur
//        user = userRepository.save(User.builder()
//                .firstname("John")
//                .lastname("Doe")
//                .email("john.doe@example.com")
//                .password("password")
//                .enabled(true)
//                .account_locked(false)
//                .roles(new HashSet<>())
//                .build());
//    }
//
//    @Test
//    void getAllUsers_shouldReturnList() throws Exception {
//        mockMvc.perform(get("/api/v1/users")
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.read"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.count").value(1))
//                .andExpect(jsonPath("$.users[0].email").value("john.doe@example.com"));
//    }
//
//    @Test
//    void getUserById_shouldReturnUser() throws Exception {
//        mockMvc.perform(get("/api/v1/users/{id}", user.getId())
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.read"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
//    }
//
//    @Test
//    void addRoleToUser_shouldAddRole() throws Exception {
//        mockMvc.perform(post("/api/v1/users/{userId}/roles/{roleId}", user.getId(), role.getId())
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.roles.create"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Rôle ajouté à l'utilisateur."));
//    }
//
//    @Test
//    void removeRoleFromUser_shouldRemoveRole() throws Exception {
//        // On ajoute d'abord le rôle à l'utilisateur
//        user.getRoles().add(role);
//        userRepository.save(user);
//
//        mockMvc.perform(delete("/api/v1/users/{userId}/roles/{roleId}", user.getId(), role.getId())
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.roles.delete"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(user.getId()));
//    }
//
//    @Test
//    void deleteUser_shouldDelete() throws Exception {
//        mockMvc.perform(delete("/api/v1/users/{id}", user.getId())
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.delete"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Utilisateur supprimé avec succès."));
//    }
//
//    @Test
//    void getUserRoles_shouldReturnRoles() throws Exception {
//        // On ajoute d'abord le rôle à l'utilisateur
//        user.getRoles().add(role);
//        userRepository.save(user);
//
//        mockMvc.perform(get("/api/v1/users/{id}/roles", user.getId())
//                        .with(user("admin").authorities(new SimpleGrantedAuthority("users.roles.read"))))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].name").value("ROLE_TEST"));
//    }
//}
