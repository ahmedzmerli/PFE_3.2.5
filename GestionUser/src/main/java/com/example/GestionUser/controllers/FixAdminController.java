//package com.example.GestionUser.controllers;
//
//import com.example.GestionUser.services.FixAdminService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//public class FixAdminController {
//
//    private final FixAdminService fixAdminService;
//
//    @GetMapping("/fix-admin")
//    public String fixAdminPermissions() {
//        fixAdminService.executeFix();
//        return "✅ Permissions mises à jour pour ADMIN.";
//    }
//}
