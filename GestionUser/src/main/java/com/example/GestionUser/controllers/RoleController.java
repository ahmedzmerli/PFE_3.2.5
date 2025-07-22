package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.entities.Role;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionListRepository permissionListRepository;


    // ✅ Créer un rôle avec des listes de permissions
    @PostMapping
    @PreAuthorize("hasAuthority('roles.create')")
    public ResponseEntity<Role> createRole(
            @RequestParam String name,
            @RequestBody List<Integer> permissionListIds
    ) {
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(BusinessErrorCodes.ROLE_NAME_REQUIRED);
        }

        if (roleRepository.findByName(name).isPresent()) {
            throw new BusinessException(BusinessErrorCodes.ROLE_ALREADY_EXISTS);
        }

        List<PermissionList> lists = permissionListRepository.findAllById(permissionListIds);
        Role newRole = Role.builder()
                .name(name)
                .permissionLists(lists)
                .build();

        return ResponseEntity.ok(roleRepository.save(newRole));
    }

    // ✅ Récupérer tous les rôles
    @GetMapping
    @PreAuthorize("hasAuthority('roles.read')")
    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    // ✅ Mettre à jour un rôle
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.update')")
    public ResponseEntity<Role> updateRole(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestBody List<Integer> permissionListIds
    ) {

        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(BusinessErrorCodes.ROLE_NAME_REQUIRED);
        }
        return roleRepository.findById(id).map(existing -> {
            existing.setName(name);
            List<PermissionList> pls = permissionListRepository.findAllById(permissionListIds);
            existing.setPermissionLists(pls);
            return ResponseEntity.ok(roleRepository.save(existing));
        }).orElseThrow(() -> new BusinessException(BusinessErrorCodes.ROLE_NOT_FOUND));
    }

    // ✅ Supprimer un rôle
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('roles.delete')")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.ROLE_NOT_FOUND));

        try {
            role.getPermissionLists().clear();
            roleRepository.save(role);
            roleRepository.delete(role);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BusinessException(BusinessErrorCodes.ROLE_DELETE_FAILED);
        }
    }


    // ✅ Lister les listes de permissions d’un rôle
    @GetMapping("/{id}/permission-lists")
    @PreAuthorize("hasAuthority('roles.permissionlists.read')")
    public ResponseEntity<List<PermissionList>> getPermissionLists(@PathVariable Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.ROLE_NOT_FOUND));
        return ResponseEntity.ok(role.getPermissionLists());
    }

    // ✅ Attribuer plusieurs listes de permissions à un rôle
    @PutMapping("/{id}/permission-lists")
    @PreAuthorize("hasAuthority('roles.permissionlists.update')")
    public ResponseEntity<Role> assignPermissionLists(
            @PathVariable Integer id,
            @RequestBody List<Integer> permissionListIds
    ) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.ROLE_NOT_FOUND));

        Set<PermissionList> merged = new HashSet<>(role.getPermissionLists());
        merged.addAll(permissionListRepository.findAllById(permissionListIds));

        role.setPermissionLists(new ArrayList<>(merged));
        return ResponseEntity.ok(roleRepository.save(role));
    }

    // ✅ Supprimer une seule permission list du rôle
    @DeleteMapping("/{roleId}/permission-lists/{listId}")
    @PreAuthorize("hasAuthority('roles.permissionlists.delete')")
    public ResponseEntity<Role> removePermissionListFromRole(
            @PathVariable Integer roleId,
            @PathVariable Integer listId
    ) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.ROLE_NOT_FOUND));
        PermissionList list = permissionListRepository.findById(listId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));

        if (role.getPermissionLists().contains(list)) {
            role.getPermissionLists().remove(list);
            roleRepository.save(role);
        }

        return ResponseEntity.ok(role);
    }
}
