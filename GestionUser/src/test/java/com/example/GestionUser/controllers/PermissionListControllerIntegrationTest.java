package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import com.example.GestionUser.repositories.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PermissionListControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PermissionListRepository permissionListRepository;

    @Autowired
    private RoleRepository roleRepository;

    private Permission perm1;
    private Permission perm2;

    @BeforeEach
    void setUp() {
        // Nettoyer les relations Role -> PermissionList
        roleRepository.findAll().forEach(role -> {
            role.getPermissionLists().clear();
            roleRepository.save(role);
        });

        permissionListRepository.deleteAll();
        permissionRepository.deleteAll();

        // Créer des permissions
        perm1 = new Permission();
        perm1.setFeature("users");
        perm1.setAction("read");
        perm1 = permissionRepository.save(perm1);

        perm2 = new Permission();
        perm2.setFeature("roles");
        perm2.setAction("create");
        perm2 = permissionRepository.save(perm2);
    }

    @Test
    void shouldCreatePermissionList() throws Exception {
        mockMvc.perform(post("/api/v1/permission-lists")
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.create")))
                        .param("name", "MyList")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(perm1.getId(), perm2.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("MyList"))
                .andExpect(jsonPath("$.permissions").isArray())
                .andExpect(jsonPath("$.permissions.length()").value(2));

        List<PermissionList> lists = permissionListRepository.findAll();
        assertThat(lists).hasSize(1);
        assertThat(lists.get(0).getPermissions()).hasSize(2);
    }

    @Test
    void shouldFetchAllPermissionLists() throws Exception {
        PermissionList list = PermissionList.builder()
                .name("TestList")
                .permissions(new java.util.HashSet<>(List.of(perm1)))
                .build();
        permissionListRepository.save(list);

        mockMvc.perform(get("/api/v1/permission-lists")
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.read"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("TestList"));
    }

    @Test
    void shouldUpdatePermissionList() throws Exception {
        PermissionList list = PermissionList.builder()
                .name("ToUpdate")
                .permissions(new java.util.HashSet<>(List.of(perm1)))
                .build();
        list = permissionListRepository.save(list);

        mockMvc.perform(put("/api/v1/permission-lists/{id}", list.getId())
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.update")))
                        .param("name", "UpdatedName")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(perm2.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UpdatedName"))
                .andExpect(jsonPath("$.permissions[0].id").value(perm2.getId()));

        PermissionList updated = permissionListRepository.findById(list.getId()).orElseThrow();
        assertThat(updated.getName()).isEqualTo("UpdatedName");
        assertThat(updated.getPermissions()).extracting("id").containsExactly(perm2.getId());
    }

    @Test
    void shouldDeletePermissionList() throws Exception {
        PermissionList list = PermissionList.builder()
                .name("ToDelete")
                .permissions(new java.util.HashSet<>(List.of(perm1)))
                .build();
        list = permissionListRepository.save(list);

        mockMvc.perform(delete("/api/v1/permission-lists/{id}", list.getId())
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.delete"))))
                .andExpect(status().isNoContent());

        assertThat(permissionListRepository.findById(list.getId())).isEmpty();
    }

    @Test
    void shouldAddPermissionsToList() throws Exception {
        PermissionList list = PermissionList.builder()
                .name("AddPerms")
                .permissions(new java.util.HashSet<>(List.of()))
                .build();
        list = permissionListRepository.save(list);

        mockMvc.perform(post("/api/v1/permission-lists/{id}/permissions", list.getId())
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.permissions.create")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(perm1.getId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.permissions.length()").value(1));

        PermissionList updated = permissionListRepository.findById(list.getId()).orElseThrow();
        assertThat(updated.getPermissions()).hasSize(1);
    }

    @Test
    void shouldRemovePermissionFromList() throws Exception {
        PermissionList list = PermissionList.builder()
                .name("RemovePerm")
                .permissions(new java.util.HashSet<>(List.of(perm1)))
                .build();
        list = permissionListRepository.save(list);

        mockMvc.perform(delete("/api/v1/permission-lists/{plId}/permissions/{permissionId}", list.getId(), perm1.getId())
                        .with(user("test").authorities(new SimpleGrantedAuthority("permissionlists.permissions.delete"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.permissions").isEmpty());

        PermissionList updated = permissionListRepository.findById(list.getId()).orElseThrow();
        assertThat(updated.getPermissions()).isEmpty();
    }
}
