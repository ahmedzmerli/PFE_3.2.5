package com.example.GestionUser.controllers;

import com.example.GestionUser.auth.AuthenticationService;
import com.example.GestionUser.auth.RegistrationRequest;
import com.example.GestionUser.entities.Role;
import com.example.GestionUser.entities.User;
import com.example.GestionUser.handler.ApiException;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.ResourceNotFoundException;
import com.example.GestionUser.repositories.RoleRepository;
import com.example.GestionUser.repositories.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
// @PreAuthorize("hasAuthority('admin.user')")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationService authService;

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('users.create')")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegistrationRequest request) throws MessagingException {
        authService.register(request);
        return ResponseEntity.accepted().body(
                Map.of("message", "Utilisateur créé, un email d'activation a été envoyé.")
        );
    }





    @GetMapping("/users")
    @PreAuthorize("hasAuthority('users.read')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(
                Map.of(
                        "count", users.size(),
                        "users", users
                )
        );
    }



    @Transactional
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('users.delete')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.USER_NOT_FOUND));
        user.getRoles().clear();
        userRepository.save(user);
        userRepository.deleteById(id);
        return ResponseEntity.ok(
                Map.of("message", "Utilisateur supprimé avec succès.")
        );
    }



    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('users.update')")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.USER_NOT_FOUND));
        try {
            user.setFirstname(updatedUser.getFirstname());
            user.setLastname(updatedUser.getLastname());
            user.setEmail(updatedUser.getEmail());
            user.setAccount_locked(updatedUser.isAccount_locked());
            // ... gestion des rôles ...
            userRepository.save(user);
            return ResponseEntity.ok(
                    Map.of("message", "Utilisateur mis à jour.", "user", user)
            );
        } catch (Exception e) {
            throw new ApiException(BusinessErrorCodes.ACCOUNT_NOT_FOUND);
        }
    }




    // @PutMapping("/users/{userId}/roles")
    // // @PreAuthorize("hasAuthority('admin.user')")
    // public ResponseEntity<?> assignRolesToUser(@PathVariable Integer userId, @RequestBody List<Integer> roleIds) {
    //     return userRepository.findById(userId).map(user -> {
    //         var roles = roleRepository.findAllById(roleIds);
    //         user.setRoles(roles);
    //         return ResponseEntity.ok(userRepository.save(user));
    //     }).orElse(ResponseEntity.notFound().build());
    // }

    @GetMapping("/users/{id}")
// @PreAuthorize("hasAuthority('admin.user')")
public ResponseEntity<User> getUserById(@PathVariable Integer id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ApiException(BusinessErrorCodes.USER_NOT_FOUND));
    return ResponseEntity.ok(user);
}


    @Transactional
    @PostMapping("/users/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('users.roles.create')")
    public ResponseEntity<?> addRoleToUser(@PathVariable Integer userId, @PathVariable Integer roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.USER_NOT_FOUND));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.ROLE_NOT_FOUND));
        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
            userRepository.save(user);
        }
        return ResponseEntity.ok(
                Map.of("message", "Rôle ajouté à l'utilisateur.", "user", user)
        );
    }

    @Transactional
    @DeleteMapping("/users/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('users.roles.delete')")

    public ResponseEntity<?> removeRoleFromUser(@PathVariable Integer userId, @PathVariable Integer roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.USER_NOT_FOUND));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ApiException(BusinessErrorCodes.ROLE_NOT_FOUND));

        user.getRoles().remove(role);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }


@GetMapping("/users/{id}/roles")
@PreAuthorize("hasAuthority('users.roles.read')")
public ResponseEntity<Set<Role>> getUserRoles(@PathVariable Integer id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
    return ResponseEntity.ok(user.getRoles());
}




}
