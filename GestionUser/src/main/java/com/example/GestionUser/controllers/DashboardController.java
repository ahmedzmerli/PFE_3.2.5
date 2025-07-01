package com.example.GestionUser.controllers;

import com.example.GestionUser.repositories.BlHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final BlHistoryRepository blHistoryRepo;

    // Récupère le nombre de blacklist par mois sur 12 mois
    @GetMapping("/blacklist-par-mois")
    @PreAuthorize("hasAuthority('dashboard.read')")
    public List<Map<String, Object>> getBlacklistParMois() {
        LocalDateTime douzeMoisAvant = LocalDateTime.now().minusMonths(12).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        return blHistoryRepo.countBlacklistByMonth(douzeMoisAvant);
    }


    @GetMapping("/blacklist-par-segment")
    @PreAuthorize("hasAuthority('dashboard.read')")
    public List<Map<String, Object>> getBlacklistParSegment() {   //si par période
        // @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        //@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
        // if (start == null) start = LocalDateTime.now().minusMonths(6);
        //    if (end == null) end = LocalDateTime.now();
        return blHistoryRepo.countBlacklistBySegment();
    }


    @GetMapping("/whitelist-par-mois")
    @PreAuthorize("hasAuthority('dashboard.read')")
    public List<Map<String, Object>> getWhitelistParMois() {
        // Par défaut, 12 derniers mois :
        LocalDateTime start = LocalDateTime.now().minusMonths(12);
        return blHistoryRepo.countWhitelistedByMonth(start);
    }

    @GetMapping("/blacklist-par-user")
    @PreAuthorize("hasAuthority('dashboard.read')")
    public List<Map<String, Object>> getBlacklistParUser() {
        return blHistoryRepo.countBlacklistByUser();
    }


}
