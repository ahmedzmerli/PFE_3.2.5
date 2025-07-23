//package com.example.GestionUser.websocket;
//
//import com.example.GestionUser.security.JwtService;
//import com.example.GestionUser.entities.User;
//import com.example.GestionUser.repositories.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//import java.security.Principal;
//import java.util.Map;
//
//@RequiredArgsConstructor
//@Component
//public class JwtHandshakeInterceptor implements HandshakeInterceptor {
//
//    private final JwtService jwtService;
//    private final UserRepository userRepository;
//
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest request,
//                                   ServerHttpResponse response,
//                                   WebSocketHandler wsHandler,
//                                   Map<String, Object> attributes) {
//        String authHeader = request.getHeaders().getFirst("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String jwt = authHeader.substring(7);
//            String username = jwtService.extractUsername(jwt);
//
//            if (username != null) {
//                attributes.put("user", (Principal) () -> username); // on injecte un Principal
//            }
//        }
//
//        return true;
//    }
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request,
//                               ServerHttpResponse response,
//                               WebSocketHandler wsHandler,
//                               Exception exception) {
//        // No-op
//    }
//}
