package com.example.GestionUser.services;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PermissionListService {
    private final PermissionListRepository repo;
    private final PermissionRepository permissionRepository;

    public PermissionList create(String name, List<Integer> permissionIds) {
        List<Permission> permissions = permissionRepository.findAllById(permissionIds);
        return repo.save(PermissionList.builder()
                .name(name)
                .permissions(new HashSet<>(permissions)) // ✅ conversion
                .build());
    }


    public void delete(Integer id) {
        PermissionList list = repo.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));

        // 1. Supprimer la relation avec les rôles (bi-directionnelle)
        list.getRoles().forEach(role -> role.getPermissionLists().remove(list));
        list.getRoles().clear(); // facultatif mais propre
    
        // 2. Supprimer la relation avec les permissions
        list.getPermissions().clear();
        repo.save(list); // Sauvegarder sans liens
    
        // 3. Supprimer la PermissionList elle-même
        repo.delete(list);
    }
    
    

    public List<PermissionList> findAll() {
        return repo.findAll();
    }

    public PermissionList update(Integer id, String name, List<Integer> permissionIds) {
        return repo.findById(id).map(existing -> {
            List<Permission> permissions = permissionRepository.findAllById(permissionIds);
            existing.setName(name);
            existing.setPermissions(new HashSet<>(permissions)); // ✅ conversion
            return repo.save(existing);
        }).orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));
    }


    public PermissionList removePermissionFromList(Integer permissionListId, Integer permissionId) {
        PermissionList permissionList = repo.findById(permissionListId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));
    
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_NOT_FOUND));
    
        boolean removed = permissionList.getPermissions().remove(permission);
    
        if (!removed) {
            throw new BusinessException(BusinessErrorCodes.PERMISSION_NOT_FOUND);
        }
    
        return repo.save(permissionList);
    }

    public PermissionList addPermissions(Integer id, List<Integer> permissionIds) {
        PermissionList list = repo.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));
    
        List<Permission> newPermissions = permissionRepository.findAllById(permissionIds);
    
        Set<Permission> updated = new HashSet<>(list.getPermissions());
        updated.addAll(newPermissions);
    
        list.setPermissions(new HashSet<>(updated));
        return repo.save(list);
    }
    

}
