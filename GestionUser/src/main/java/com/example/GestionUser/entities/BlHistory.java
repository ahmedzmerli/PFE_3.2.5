package com.example.GestionUser.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "BL_HISTORY") //On ajoute schema = "CCADMIN"
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlHistory {



//    @Id
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bl_hist_seq")
//    @SequenceGenerator(
//            name = "bl_hist_seq",
//            sequenceName = "BL_HIST_SEQ",   // <= 30 car. pour Oracle
//            allocationSize = 1              // pas de saut de valeurs
//    )
//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MSISDN")
    private String msisdn;
    @Column(name = "USERNAME")
    private String username;


@Column(name = "MOTIF")
    private String motif;
    @Column(name = "STATUBL")
    private String statutBl;// e.g., "BLACKLISTED", "WHITELISTED"
    @Column(name = "OFFRE")
    private String offre;
    @Column(name = "SEGMENT")
    private String segment;

    @Column(name = "TYPECLIENT")
    private String typeClient;

    @Column(name = "DATE_ACTION")
    private LocalDateTime dateAction;

    @Column(name = "TYPEBLACK")
    private String typeBlack;

    @Column(name = "DATE_DEBUT")
    private LocalDateTime dateDebut;
    @Column(name = "DATE_FIN")
    private LocalDateTime dateFin;

    private String tmcode;
    private String hourBl;
    private LocalDateTime dateLastBlacklist;


//    /* ---------- Audit technique ---------- */
//    @CreatedDate
//    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
//    private LocalDateTime createdDate;          // date d’insertion
//
//    @LastModifiedDate
//    @Column(name = "LAST_MODIFIED_DATE")
//    private LocalDateTime lastModifiedDate;     // date de mise à jour
//
//    @CreatedBy
//    @Column(name = "CREATED_BY", updatable = false, length = 100)
//    private String createdBy;                   // email créateur
//
//    @LastModifiedBy
//    @Column(name = "MODIFIED_BY", length = 100)
//    private String modifiedBy;                  // email modificateur
}
