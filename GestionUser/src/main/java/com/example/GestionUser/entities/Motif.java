//package com.example.GestionUser.entities;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class Motif {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//private Long id;
//private String designation;
//
//    @OneToMany(mappedBy = "motif", fetch = FetchType.LAZY)
//    @JsonIgnore           // évite la boucle infinie en JSON
//    private Set<BlHistory> histories = new HashSet<>();
//}
