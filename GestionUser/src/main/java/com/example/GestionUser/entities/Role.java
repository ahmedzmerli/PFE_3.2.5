package com.example.GestionUser.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
 @Entity
 @Table(name = "role")
 @EntityListeners(AuditingEntityListener.class)
public class Role {

//        @Id
//        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "role_seq")
//        @SequenceGenerator(name = "role_seq", sequenceName = "ROLE_SEQ", allocationSize = 1)
@Id
@GeneratedValue
        private Integer id;
        @Column(unique = true)
        private String name;
        @ManyToMany(mappedBy = "roles")
        @JsonIgnore
        private Set<User> user;

        @ManyToMany(fetch = FetchType.EAGER)
@JoinTable(
  name = "role_permission_list",
  joinColumns = @JoinColumn(name = "role_id"),
  inverseJoinColumns = @JoinColumn(name = "permission_lists_id")
)
private List<PermissionList> permissionLists;


        @CreatedDate
        @Column(nullable = false, updatable = false)
        private LocalDateTime created_date;

        @LastModifiedDate
        @Column(insertable = false)
        private LocalDateTime last_modified_date;


        @Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Role role = (Role) o;
    return id != null && id.equals(role.id);
}

@Override
public int hashCode() {
    return getClass().hashCode();
}
}
