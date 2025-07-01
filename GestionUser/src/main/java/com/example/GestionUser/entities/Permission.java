package com.example.GestionUser.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    @Id
    @GeneratedValue
    private Integer id;

    private String feature; // ex: "blacklist"
    private String action;  // ex: "read"

    @Override
    public String toString() {
        return feature + "." + action;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Permission that = (Permission) o;
        return feature.equals(that.feature) && action.equals(that.action);
    }

    @Override
    public int hashCode() {
        return Objects.hash(feature, action);
    }

}
