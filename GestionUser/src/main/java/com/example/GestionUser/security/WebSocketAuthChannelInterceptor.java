//package com.example.GestionUser.security;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {
//
//    private final JwtService jwtService; // Ton service JWT existant
//    private final UserDetailsService userDetailsService;
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//
//        var authHeaders = accessor.getNativeHeader("Authorization");
//        if (authHeaders != null && !authHeaders.isEmpty()) {
//            String token = authHeaders.get(0).replace("Bearer ", "");
//            String username = jwtService.extractUsername(token);
//            var userDetails = userDetailsService.loadUserByUsername(username);
//
//            var authentication = new UsernamePasswordAuthenticationToken(
//                    userDetails, null, userDetails.getAuthorities()
//            );
//            accessor.setUser(authentication);
//            accessor.getSessionAttributes().put("username", username);
//        }
//
//        return message;
//    }
//}
