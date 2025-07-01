package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.jim.JimDashboard;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.services.JimDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class JimDashboardController {

    private final JimDashboardService service;

    @GetMapping
    @PreAuthorize("hasAuthority('dashboard.read')")
    public List<JimDashboard> searchDashboard(
            @RequestParam String msisdn,
            @RequestParam String hotline,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        if (msisdn == null || msisdn.isBlank()) {
            throw new BusinessException(BusinessErrorCodes.JIM_MSISDN_REQUIRED);
        }
        if (hotline == null || hotline.isBlank()) {
            throw new BusinessException(BusinessErrorCodes.JIM_HOTLINE_REQUIRED);
        }

        // Logique : si start ou end manquant → complète avec 12 jours
        if (start != null && end == null) {
            end = start.plusDays(12);
        } else if (end != null && start == null) {
            start = end.minusDays(12);
        }

        return service.searchDashboard(msisdn, hotline, start, end);
    }

}