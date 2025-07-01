package com.example.GestionUser.utils;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PermissionUtils {

    public String mapHttpToAction(String method) {
        return switch (method.toUpperCase()) {
            case "GET" -> "read";
            case "POST" -> "create";
            case "PUT", "PATCH" -> "update";
            case "DELETE" -> "delete";
            default -> "unknown";
        };
    }

    public String extractFeatureFromPath(String path) {  //limite à deux segments (subList(0, 2)) → “blacklist.toggle”.
        // Si un endpoint a plus de deux segments significatifs (ex. /stats/repartition-par-anciennete) il sera tronqué
        if (path.startsWith("/api/v1/")) {
            path = path.substring("/api/v1/".length());
        }

        String[] segments = path.split("/");

        List<String> logicalParts = new ArrayList<>();
        for (String segment : segments) {
            // ✅ Ignore ID dynamique entre {} ou chiffres purs
            if (segment.matches("\\{.*?}")) continue; // segments comme {id}, {userId}
            if (segment.matches("\\d+")) continue;    // segments comme 123

            logicalParts.add(segment.replaceAll("-", ""));
        }

        if (logicalParts.isEmpty()) return "unknown";

        return String.join(".", logicalParts.subList(0, Math.min(2, logicalParts.size())));
    }

}
