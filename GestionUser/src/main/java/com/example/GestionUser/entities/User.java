package com.example.GestionUser.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static jakarta.persistence.FetchType.EAGER;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Builder
 @Entity
 @Table(name = "_user")
 @EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails, Principal {

    //Si Oracle sup 12 on laisse IDENTITY c pas grave
    //Sinon
//    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
//    @SequenceGenerator(name="user_seq", sequenceName="USER_SEQ", allocationSize=1)

    @Id
    @GeneratedValue
    private Integer id;
    private String firstname;
    private String lastname;
    @Column(unique = true)
    private String email;
    private String password;
    @Column(name = "account_locked", nullable = false)
    private boolean account_locked;
    private boolean enabled;

    @ManyToMany(fetch = EAGER)
    private Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Token> tokens;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_date;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime last_modified_date;

//     @Override
// public Collection<? extends GrantedAuthority> getAuthorities() {
//     return this.roles.stream()
//             .flatMap(role -> role.getPermissionLists().stream())
//             .flatMap(pl -> pl.getPermissions().stream())
//             .map(Permission::toString)
//             .distinct() // déduplique avant de mapper
//             .map(SimpleGrantedAuthority::new)
//             .collect(Collectors.toSet()); // ou toList() si tu préfères, les doublons sont déjà exclus
// }

@Override
@JsonIgnore
public Collection<? extends GrantedAuthority> getAuthorities() {
    if (roles == null) return List.of();

    return roles.stream()
            .filter(role -> role.getPermissionLists() != null)
            .flatMap(role -> role.getPermissionLists().stream())
            .filter(pl -> pl.getPermissions() != null)
            .flatMap(pl -> pl.getPermissions().stream())
            .map(Permission::toString)
            .distinct()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toSet());
}






    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !account_locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String fullName() {
        return getFirstname() + " " + getLastname();
    }

    @Override
    public String getName() {
        return email;
    }

    public String getFullName() {
        return firstname + " " + lastname;
    }
}
