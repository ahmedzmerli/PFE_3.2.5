package com.example.GestionUser.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PdvDTO {
    private String msisdn;
    private String nomPdv;
    private String adresse;
    private String codePdv;
    private Double latitude;
    private Double longitude;

}
