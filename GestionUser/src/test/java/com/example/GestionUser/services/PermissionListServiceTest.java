package com.example.GestionUser.services;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class PermissionListServiceTest {

    @InjectMocks
    private PermissionListService service;

    @Mock
    private PermissionListRepository repo;

    @Mock
    private PermissionRepository permissionRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void create_shouldSavePermissionList() {
        // Arrange
        String name = "PL1";
        List<Integer> permissionIds = List.of(1, 2);

        Permission p1 = new Permission();
        p1.setId(1);
        p1.setFeature("users");
        p1.setAction("read");

        Permission p2 = new Permission();
        p2.setId(2);
        p2.setFeature("roles");
        p2.setAction("create");

        when(permissionRepository.findAllById(permissionIds))
                .thenReturn(List.of(p1, p2));

        PermissionList saved = PermissionList.builder()
                .id(10)
                .name(name)
                .permissions(new HashSet<>(Set.of(p1, p2)))
                .build();

        when(repo.save(any(PermissionList.class))).thenReturn(saved);

        // Act
        PermissionList result = service.create(name, permissionIds);

        // Assert
        assertThat(result.getId()).isEqualTo(10);
        assertThat(result.getName()).isEqualTo(name);
        assertThat(result.getPermissions()).containsExactlyInAnyOrder(p1, p2);

        verify(repo).save(any(PermissionList.class));
    }

    @Test
    void delete_shouldThrowExceptionIfNotFound() {
        // Arrange
        when(repo.findById(99)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> service.delete(99))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException)e).getErrorCode())
                .isEqualTo(BusinessErrorCodes.PERMISSION_LIST_NOT_FOUND);
    }

    @Test
    void delete_shouldRemoveRelationsAndDelete() {
        // Arrange
        Permission p = new Permission();
        p.setId(1);
        p.setFeature("users");
        p.setAction("read");

        PermissionList list = PermissionList.builder()
                .id(1)
                .permissions(new HashSet<>(Set.of(p)))
                .roles(new java.util.ArrayList<>())
                .build();

        when(repo.findById(1)).thenReturn(Optional.of(list));

        // Act
        service.delete(1);

        // Assert
        assertThat(list.getPermissions()).isEmpty();
        verify(repo).save(list);
        verify(repo).delete(list);
    }

    @Test
    void update_shouldUpdatePermissionsAndName() {
        // Arrange
        Integer id = 5;
        String newName = "UpdatedPL";
        List<Integer> permissionIds = List.of(3);

        Permission newPermission = new Permission();
        newPermission.setId(3);
        newPermission.setFeature("roles");
        newPermission.setAction("update");

        PermissionList existing = PermissionList.builder()
                .id(id)
                .name("OldName")
                .permissions(new HashSet<>())
                .build();

        when(repo.findById(id)).thenReturn(Optional.of(existing));
        when(permissionRepository.findAllById(permissionIds)).thenReturn(List.of(newPermission));
        when(repo.save(any(PermissionList.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PermissionList result = service.update(id, newName, permissionIds);

        // Assert
        assertThat(result.getName()).isEqualTo(newName);
        assertThat(result.getPermissions()).containsExactly(newPermission);
    }

    @Test
    void removePermissionFromList_shouldRemovePermission() {
        // Arrange
        Integer listId = 1;
        Integer permId = 2;

        Permission permission = new Permission();
        permission.setId(permId);
        permission.setFeature("roles");
        permission.setAction("delete");

        PermissionList list = PermissionList.builder()
                .id(listId)
                .permissions(new HashSet<>(Set.of(permission)))
                .build();

        when(repo.findById(listId)).thenReturn(Optional.of(list));
        when(permissionRepository.findById(permId)).thenReturn(Optional.of(permission));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PermissionList result = service.removePermissionFromList(listId, permId);

        // Assert
        assertThat(result.getPermissions()).doesNotContain(permission);
    }

    @Test
    void removePermissionFromList_shouldThrowIfPermissionNotFound() {
        // Arrange
        Integer listId = 1;
        Integer permId = 2;

        PermissionList list = PermissionList.builder()
                .id(listId)
                .permissions(new HashSet<>())
                .build();

        Permission permission = new Permission();
        permission.setId(permId);
        permission.setFeature("roles");
        permission.setAction("delete");

        when(repo.findById(listId)).thenReturn(Optional.of(list));
        when(permissionRepository.findById(permId)).thenReturn(Optional.of(permission));

        // Act + Assert
        assertThatThrownBy(() -> service.removePermissionFromList(listId, permId))
                .isInstanceOf(BusinessException.class)
                .extracting(e -> ((BusinessException)e).getErrorCode())
                .isEqualTo(BusinessErrorCodes.PERMISSION_NOT_FOUND);
    }

    @Test
    void addPermissions_shouldAddPermissionsToList() {
        // Arrange
        Integer id = 1;

        Permission existing = new Permission();
        existing.setId(1);
        existing.setFeature("users");
        existing.setAction("read");

        Permission newPerm = new Permission();
        newPerm.setId(2);
        newPerm.setFeature("roles");
        newPerm.setAction("create");

        PermissionList list = PermissionList.builder()
                .id(id)
                .permissions(new HashSet<>(Set.of(existing)))
                .build();

        when(repo.findById(id)).thenReturn(Optional.of(list));
        when(permissionRepository.findAllById(List.of(2))).thenReturn(List.of(newPerm));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        PermissionList result = service.addPermissions(id, List.of(2));

        // Assert
        assertThat(result.getPermissions()).containsExactlyInAnyOrder(existing, newPerm);
    }
}
