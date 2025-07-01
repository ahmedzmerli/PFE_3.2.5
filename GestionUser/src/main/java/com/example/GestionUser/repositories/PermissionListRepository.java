package com.example.GestionUser.repositories;

import com.example.GestionUser.entities.PermissionList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionListRepository extends JpaRepository<PermissionList, Integer> {
    Optional<PermissionList> findByName(String name);
    List<PermissionList> findAllByNameIgnoreCase(String name);

}
