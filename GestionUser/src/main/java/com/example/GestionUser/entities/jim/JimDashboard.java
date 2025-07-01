package com.example.GestionUser.entities.jim;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class JimDashboard {
    @Id
    private String CALLID;
    private String CONNID;
    private String AGENT;
    private LocalDateTime DEBUT_APPEL;
    private LocalDateTime FIN_APPEL;
    private String HOTLINE;
    private String NUM_CLIENT;
    private String TIME_IN_QUEUE;
    private String FILE_ATT;
    private LocalDateTime DATE_HEURS;
    private String STATUS;
    private String SEGMENT;
    // changer dans le service et repo et ajouter un Loading dans le front car la req prend beaucoup du temps

}
