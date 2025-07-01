package com.example.GestionUser.dto;


import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlacklistDTO {
    private Long id;
    private String msisdn;
    private String segment;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String motif;
    private String offre;
    private String statut;
    private String username;
    private String typeClient;
    private Long dureeBlacklist;
    private LocalDateTime dateAction;
}
