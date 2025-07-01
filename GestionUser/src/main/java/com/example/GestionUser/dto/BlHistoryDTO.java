package com.example.GestionUser.dto;


import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlHistoryDTO {
    private String msisdn;
    private String username;
    private String motif;
    private String statut;
    private String offre;
    private String segment;
    private String typeClient;
    private LocalDateTime dateAction;
    private LocalDateTime startDate;   // pour DATE_DEBUT
    private LocalDateTime endDate;     // pour DATE_FIN
    private String typeBlack;
}