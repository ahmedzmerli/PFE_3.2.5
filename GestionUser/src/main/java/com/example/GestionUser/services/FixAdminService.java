//package com.example.GestionUser.services;
//
//import com.example.GestionUser.entities.Permission;
//import com.example.GestionUser.entities.PermissionList;
//import com.example.GestionUser.entities.Role;
//import com.example.GestionUser.repositories.PermissionListRepository;
//import com.example.GestionUser.repositories.PermissionRepository;
//import com.example.GestionUser.repositories.RoleRepository;
//import com.example.GestionUser.repositories.UserRepository;
//import com.example.GestionUser.utils.PermissionUtils;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
//
//import java.util.*;
//
//@Service
//@RequiredArgsConstructor
//public class FixAdminService {
//
//    private final RequestMappingHandlerMapping mapping;
//    private final PermissionRepository permissionRepository;
//    private final PermissionListRepository permissionListRepository;
//    private final RoleRepository roleRepository;
//    private final UserRepository userRepository;
//    private final PermissionUtils permissionUtils;
//
//    public void executeFix() {
//        var mappings = mapping.getHandlerMethods();
//        Set<Permission> newPermissions = new HashSet<>();
//
//        for (var entry : mappings.entrySet()) {
//            var info = entry.getKey();
//
//            if (info.getPatternsCondition() == null) continue;
//
//            var patterns = info.getPatternsCondition().getPatterns();
//            for (var pattern : patterns) {
//                for (var method : info.getMethodsCondition().getMethods()) {
//                    String action = permissionUtils.mapHttpToAction(method.name());
//                    String feature = permissionUtils.extractFeatureFromPath(pattern);
//
//                    if (feature.equals("unknown") || action.equals("unknown")) continue;
//
//                    permissionRepository.findByFeatureAndAction(feature, action)
//                            .or(() -> {
//                                Permission p = permissionRepository.save(
//                                        Permission.builder()
//                                                .feature(feature)
//                                                .action(action)
//                                                .build()
//                                );
//                                newPermissions.add(p);
//                                return Optional.of(p);
//                            });
//                }
//            }
//        }
//
//        // Mise à jour ADMIN_PL
//        PermissionList adminPL = permissionListRepository.findAll().stream()
//                .filter(pl -> pl.getName().equalsIgnoreCase("ADMIN_PL"))
//                .findFirst()
//                .orElseGet(() -> permissionListRepository.save(
//                        PermissionList.builder()
//                                .name("ADMIN_PL")
//                                .permissions(new HashSet<>())
//                                .build()
//                ));
//
//        Set<Permission> updated = new HashSet<>(adminPL.getPermissions());
//        updated.addAll(newPermissions);
//        adminPL.setPermissions(new HashSet<>(updated));
//        adminPL = permissionListRepository.save(adminPL);
//
//        // Associer au rôle ADMIN
//        Role adminRole = roleRepository.findByName("ADMIN")
//                .orElseGet(() -> roleRepository.save(
//                        Role.builder()
//                                .name("ADMIN")
//                                .permissionLists(new ArrayList<>())
//                                .build()
//                ));
//
//        if (adminRole.getPermissionLists().stream().noneMatch(pl -> pl.getName().equalsIgnoreCase("ADMIN_PL"))) {
//            adminRole.getPermissionLists().add(adminPL);
//            roleRepository.save(adminRole);
//        }
//
//        // Associer au user admin@gmail.com
//        userRepository.findByEmail("admin@gmail.com").ifPresent(user -> {
//            if (!user.getRoles().contains(adminRole)) {
//                user.getRoles().add(adminRole);
//                userRepository.save(user);
//            }
//        });
//
//        System.out.println("✅ Permissions mises à jour via FixAdminService.");
//    }
//}
