package com.example.GestionUser.websocket;

import com.example.GestionUser.entities.ChatMessage;
import com.example.GestionUser.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository repository;

    // 🔌 Reçoit les messages depuis Angular (via /app/chat.send)
    @MessageMapping("/chat.send")
    @SendTo("/topic/public") // diffuse à tous les abonnés
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        repository.save(message);
        return message;
    }
}
