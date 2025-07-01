package com.example.GestionUser.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "permission_list")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionList {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(unique = true)
    private String name; // ex: PL1, AdminPL

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Permission> permissions;

    @ManyToMany(mappedBy = "permissionLists")
    @JsonIgnore
private List<Role> roles;

}
