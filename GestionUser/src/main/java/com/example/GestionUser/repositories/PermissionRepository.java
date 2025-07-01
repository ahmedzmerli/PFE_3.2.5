package com.example.GestionUser.repositories;

import com.example.GestionUser.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Optional<Permission> findByFeatureAndAction(String feature, String action);
}
