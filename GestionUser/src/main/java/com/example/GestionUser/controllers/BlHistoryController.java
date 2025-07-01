package com.example.GestionUser.controllers;




import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.GestionUser.dto.BlHistoryDTO;
import com.example.GestionUser.services.BlHistoryService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/blhistory")
@RequiredArgsConstructor
public class BlHistoryController {

    private final BlHistoryService service;

//    @GetMapping
//    public List<BlHistoryDTO> searchHistory(
//            @RequestParam String msisdn,
//            @RequestParam(required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
//            @RequestParam(required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
//
//        // Validation msisdn obligatoire
//        if (msisdn == null || msisdn.isBlank()) {
//            throw new IllegalArgumentException("MSISDN est requis");
//        }
//
//        return service.search(msisdn, start, end);
//    }
//

    @GetMapping
    @PreAuthorize("hasAuthority('blhistory.read')")
    public List<BlHistoryDTO> searchHistory(
            @RequestParam String msisdn,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        if (msisdn == null || msisdn.isBlank()) {
            throw new BusinessException(BusinessErrorCodes.BL_HISTORY_MSISDN_REQUIRED);
        }

        return service.search(msisdn, start, end);
    }

}

