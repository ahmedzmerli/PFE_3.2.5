package com.example.GestionUser.controllers;

import com.example.GestionUser.entities.ChatMessage;
import com.example.GestionUser.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatMessageRepository repository;

    @GetMapping
    public List<ChatMessage> getAllMessages() {
        return repository.findAll();
    }
}
