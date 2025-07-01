package com.example.GestionUser.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pdv_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PdvMaster {

    @Id
    private String msisdn;

    @Column(name = "nom_pdv")
    private String nomPdv;

    @Column(name = "adresse")
    private String adresse;
    @Column(name = "code_pdv")
    private String codePdv;


    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

}
