package com.example.GestionUser.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = {"/CTI-Tool", "/CTI-Tool/", "/CTI-Tool/**"})
    public String redirectToIndex() {
        return "forward:/CTI-Tool/index.html";
    }
}

