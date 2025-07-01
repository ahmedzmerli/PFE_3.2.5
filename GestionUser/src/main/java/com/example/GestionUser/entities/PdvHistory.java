package com.example.GestionUser.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pdv_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PdvHistory {

//    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pdv_hist_seq")
//    @SequenceGenerator(name = "pdv_hist_seq", sequenceName = "PDV_HIST_SEQ", allocationSize = 1)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String msisdn;
    private String nomPdv;
    private String adresse;
    private String codePdv;

    private String username; // qui a fait l'action
    private String actionType; // CREATE ou DELETE
    private LocalDateTime dateAction;

//    @CreatedDate   @Column(nullable = false, updatable = false)
//    private LocalDateTime createdDate;
//
//    @LastModifiedDate
//    private LocalDateTime lastModifiedDate;
//
//    @CreatedBy     @Column(updatable = false, length = 100)
//    private String createdBy;
//
//    @LastModifiedBy @Column(length = 100)
//    private String modifiedBy;
}
