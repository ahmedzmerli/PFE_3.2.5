package com.example.GestionUser.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PdvHistoryDTO {
    private String msisdn;
    private String nomPdv;
    private String adresse;
    private String codePdv;
    private String username;
    private String actionType;
    private LocalDateTime dateAction;
}
