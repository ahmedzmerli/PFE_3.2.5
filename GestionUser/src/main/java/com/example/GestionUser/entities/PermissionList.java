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


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PermissionList that = (PermissionList) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
