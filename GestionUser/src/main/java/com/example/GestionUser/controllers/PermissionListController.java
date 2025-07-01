package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import com.example.GestionUser.services.PermissionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permission-lists")
@RequiredArgsConstructor
// @PreAuthorize("hasAuthority('permissionlists.read')")
public class PermissionListController {

    private final PermissionListService service;
    private final PermissionRepository permissionRepository;
    private final PermissionListRepository permissionListRepository;

    // ✅ Créer une nouvelle liste avec des permissions
    @PostMapping
    @PreAuthorize("hasAuthority('permissionlists.create')")
    public ResponseEntity<PermissionList> create(
            @RequestParam String name,
            @RequestBody List<Integer> permissionIds
    ) {
        if (name == null || name.isBlank()) {
            throw new BusinessException(BusinessErrorCodes.PERMISSION_NAME_REQUIRED);
        }

        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new BusinessException(BusinessErrorCodes.PERMISSION_LIST_EMPTY);
        }

        return ResponseEntity.ok(service.create(name, permissionIds));
    }

    // ✅ Modifier une liste existante
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('permissionlists.update')")
    public ResponseEntity<PermissionList> update(
            @PathVariable Integer id,
            @RequestParam String name,
            @RequestBody List<Integer> permissionIds
    ) {
        return ResponseEntity.ok(service.update(id, name, permissionIds));
    }

    // ✅ Supprimer une liste
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('permissionlists.delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Récupérer toutes les listes
    @GetMapping
    @PreAuthorize("hasAuthority('permissionlists.read')")
    public List<PermissionList> list() {
        return service.findAll();
    }

    // ✅ Ajouter plusieurs permissions à une liste existante
    @PostMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('permissionlists.permissions.create')")
    public ResponseEntity<PermissionList> addPermissionsToList(
            @PathVariable Integer id,
            @RequestBody List<Integer> permissionIds
    ) {
        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new BusinessException(BusinessErrorCodes.PERMISSION_LIST_EMPTY);
        }



        PermissionList list = service.addPermissions(id, permissionIds);
        return ResponseEntity.ok(list);
    }

    // ✅ Ajouter une permission unique (alternative plus fine)
    @PostMapping("/{plId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('permissionlists.permissions.create')")
    public ResponseEntity<?> assignPermissionToList(
            @PathVariable Integer plId,
            @PathVariable Integer permissionId
    ) {
        PermissionList pl = permissionListRepository.findById(plId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.PERMISSION_NOT_FOUND));

        if (pl.getPermissions().contains(permission)) {
            throw new BusinessException(BusinessErrorCodes.PERMISSION_ALREADY_ASSIGNED);
        }

        pl.getPermissions().add(permission);
        permissionListRepository.save(pl);
        return ResponseEntity.ok("Permission assigned");



//        if (!pl.getPermissions().contains(permission)) {
//            pl.getPermissions().add(permission);
//            permissionListRepository.save(pl);
//        }


    }

    // ✅ Supprimer une permission d'une liste
    @DeleteMapping("/{plId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('permissionlists.permissions.delete')")
    public ResponseEntity<PermissionList> removePermissionFromList(
            @PathVariable Integer plId,
            @PathVariable Integer permissionId
    ) {
        return ResponseEntity.ok(service.removePermissionFromList(plId, permissionId));
    }
}
