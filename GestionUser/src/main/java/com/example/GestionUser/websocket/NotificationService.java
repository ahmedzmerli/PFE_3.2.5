//package com.example.GestionUser.websocket;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//public class NotificationService {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public void sendRoleAssignedNotification(String recipientUsername, String roleName) {
//        NotificationMessage message = new NotificationMessage(
//                recipientUsername,
//                "Un nouveau rôle vous a été attribué : " + roleName,
//                LocalDateTime.now().toString()
//        );
//
//        messagingTemplate.convertAndSendToUser(
//                recipientUsername,
//                "/queue/notifications",
//                message
//        );
//    }
//}
