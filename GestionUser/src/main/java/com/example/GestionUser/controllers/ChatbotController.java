package com.example.GestionUser.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatbotController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<String> askBot(@RequestBody Map<String, String> body) {
        String question = body.get("question");
        String response = restTemplate.postForObject("http://localhost:8000/chat", Map.of("question", question), String.class);
        return ResponseEntity.ok(response);
    }
}
