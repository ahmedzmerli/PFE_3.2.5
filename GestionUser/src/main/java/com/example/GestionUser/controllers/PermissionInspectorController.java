package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.User;
import com.example.GestionUser.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class PermissionInspectorController {

    private final UserRepository userRepository;

    @GetMapping("/{id}/permissions")
    public ResponseEntity<Set<String>> getUserPermissions(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Set<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissionLists().stream())
                .flatMap(pl -> pl.getPermissions().stream())
                .map(Permission::toString) // produit feature.action
                .collect(Collectors.toSet());

        return ResponseEntity.ok(permissions);
    }
}
