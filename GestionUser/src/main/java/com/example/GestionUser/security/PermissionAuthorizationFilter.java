package com.example.GestionUser.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class PermissionAuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getServletPath(); // utilisé pour logs et contrôle
        String fullPath = request.getRequestURI(); // utilisé pour les exclusions précises

        // 🔓 Skip security checks for public endpoints and static/sockjs
        if (

                        fullPath.equals("/favicon.ico") ||
                        fullPath.equals("/index.html") ||
                                fullPath.matches(".*\\.(js|css|png|jpg|jpeg|svg)$") ||// ✅ AJOUT ICI
                        fullPath.startsWith("/ws") ||

                        fullPath.startsWith("/sockjs-node") || // utile en dev Angular
                        fullPath.startsWith("/api/v1/auth") ||
                        fullPath.startsWith("/api/v1/permissions") ||
                        fullPath.equals("/api/v1/fix-admin")
//                                ||
////                        fullPath.equals("/error")

//                        fullPath.equals("/api/chat/history")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            String method = request.getMethod().toLowerCase();
            String path = request.getRequestURI();
            String feature = extractFeatureFromPath(path);
            String action = mapHttpToAction(method);
            String requiredPermission = feature + "." + action;

            Set<String> userPermissions = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            log.info("📥 URI: {}", uri);
            log.info("🔐 Required: {}", requiredPermission);
            log.info("✅ User Permissions: {}", userPermissions);

            // ✅ TEMP FIX : bypass for permissionlists.create (debug)
            if (uri.equals("/api/v1/permission-lists") && method.equals("post")) {
                if (!userPermissions.contains("permissionlists.create")) {
                    log.warn("❌ Missing permissionlists.create for POST");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Missing permission: permissionlists.create\"}");
                    return;
                } else {
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            if (!userPermissions.contains(requiredPermission)) {
                log.warn("❌ Permission manquante: {}", requiredPermission);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Access denied - missing permission: " + requiredPermission + "\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractFeatureFromPath(String path) {
        if (path.startsWith("/api/v1/")) {
            path = path.substring("/api/v1/".length());
        }

        int paramIndex = path.indexOf("?");
        if (paramIndex != -1) {
            path = path.substring(0, paramIndex);
        }

        String[] segments = path.split("/");
        List<String> logicalParts = new ArrayList<>();
        for (String segment : segments) {
            if (!segment.matches("\\d+")) {
                logicalParts.add(segment.replaceAll("-", ""));
            }
        }

        if (logicalParts.isEmpty()) return "unknown";

        return String.join(".", logicalParts.subList(0, Math.min(2, logicalParts.size()))); // ex: "blacklist.toggle"
    }

    private String mapHttpToAction(String method) {
        return switch (method.toLowerCase()) {
            case "get" -> "read";
            case "post" -> "create";
            case "put", "patch" -> "update";
            case "delete" -> "delete";
            default -> "unknown";
        };
    }
}
