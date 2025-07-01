package com.example.GestionUser.services;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.entities.Role;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import com.example.GestionUser.repositories.RoleRepository;
import com.example.GestionUser.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository repo;
    private final PermissionListRepository permissionListRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    public Permission create(String feature, String action) {
        // ✅ Vérifie si la permission existe déjà
        Optional<Permission> existing = repo.findAll().stream()
                .filter(p -> p.getFeature().equals(feature) && p.getAction().equals(action))
                .findFirst();

        Permission permission = existing.orElseGet(() ->
                repo.save(Permission.builder().feature(feature).action(action).build())
        );

        // 1. Ajouter à ADMIN_PL (ou le créer s'il n'existe pas)
        PermissionList adminPL = permissionListRepository.findAll().stream()
                .filter(pl -> pl.getName().equalsIgnoreCase("ADMIN_PL"))
                .findFirst()
                .orElseGet(() -> {
                    PermissionList pl = new PermissionList();
                    pl.setName("ADMIN_PL");
                    pl.setPermissions(new HashSet<>());
                    return permissionListRepository.save(pl);
                });

        if (!adminPL.getPermissions().contains(permission)) {
            adminPL.getPermissions().add(permission);
            adminPL = permissionListRepository.save(adminPL);
        }

        // 2. Lier ADMIN_PL au rôle ADMIN
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ADMIN");
                    role.setPermissionLists(new ArrayList<>());
                    return roleRepository.save(role);
                });

        if (!adminRole.getPermissionLists().contains(adminPL)) {
            adminRole.getPermissionLists().add(adminPL);
            roleRepository.save(adminRole);
        }

        // 3. Donner le rôle à admin@gmail.com
        userRepository.findByEmail("admin@gmail.com").ifPresent(adminUser -> {
            if (!adminUser.getRoles().contains(adminRole)) {
                adminUser.getRoles().add(adminRole);
                userRepository.save(adminUser);
            }
        });

        return permission;
    }

    public List<Permission> listAll() {
        return repo.findAll();
    }

    public Optional<Permission> update(Integer id, Permission p) {
        return repo.findById(id).map(existing -> {
            existing.setFeature(p.getFeature());
            existing.setAction(p.getAction());
            return repo.save(existing);
        });
    }
    
    public void delete(Integer id) {
        removeFromAllPermissionLists(id);
        repo.deleteById(id);
    }

    public void removeFromAllPermissionLists(Integer permissionId) {
        Permission permission = repo.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
    
        List<PermissionList> affectedLists = permissionListRepository.findAll();
    
        for (PermissionList list : affectedLists) {
            if (list.getPermissions().remove(permission)) {
                permissionListRepository.save(list);
            }
        }
    }
  
    public Map<String, List<String>> getDistinctFeaturesAndActions() {
        List<Permission> all = listAll();
        List<String> features = all.stream().map(Permission::getFeature).distinct().toList();
        List<String> actions = all.stream().map(Permission::getAction).distinct().toList();
        return Map.of("features", features, "actions", actions);
    }
    
}

