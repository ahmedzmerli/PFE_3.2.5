package com.example.GestionUser;

import com.example.GestionUser.entities.Permission;
import com.example.GestionUser.entities.PermissionList;
import com.example.GestionUser.entities.Role;
import com.example.GestionUser.entities.User;
import com.example.GestionUser.repositories.PermissionListRepository;
import com.example.GestionUser.repositories.PermissionRepository;
import com.example.GestionUser.repositories.RoleRepository;
import com.example.GestionUser.repositories.UserRepository;
import com.example.GestionUser.utils.PermissionUtils;
import org.reflections.Reflections;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class GestionUserApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionUserApplication.class, args);
	}

	@Bean
	public CommandLineRunner initPermissionsAndAdmin(
			PermissionRepository permissionRepository,
			PermissionListRepository permissionListRepository,
			RoleRepository roleRepository,
			UserRepository userRepository,
			PermissionUtils permissionUtils,
			PasswordEncoder passwordEncoder
	) {
		return args -> {
			System.out.println("🔍 Génération des permissions via Reflections...");

			Reflections reflections = new Reflections("com.example.GestionUser.controllers");
			Set<Class<?>> controllerClasses = reflections.getTypesAnnotatedWith(RestController.class);

			Set<String> existingLabels = permissionRepository.findAll().stream()
					.map(p -> p.getFeature() + "." + p.getAction())
					.collect(Collectors.toSet());

			Set<String> seen = new HashSet<>();
			List<Permission> newPermissions = new ArrayList<>();

			for (Class<?> controller : controllerClasses) {
				String basePath = "";
				if (controller.isAnnotationPresent(RequestMapping.class)) {
					RequestMapping rm = controller.getAnnotation(RequestMapping.class);
					basePath = rm.value().length > 0 ? rm.value()[0] : "";
				}

				for (Method method : controller.getDeclaredMethods()) {
					String path = "";
					String httpMethod = "";

					if (method.isAnnotationPresent(GetMapping.class)) {
						httpMethod = "GET";
						path = method.getAnnotation(GetMapping.class).value().length > 0
								? method.getAnnotation(GetMapping.class).value()[0]
								: "";
					} else if (method.isAnnotationPresent(PostMapping.class)) {
						httpMethod = "POST";
						path = method.getAnnotation(PostMapping.class).value().length > 0
								? method.getAnnotation(PostMapping.class).value()[0]
								: "";
					} else if (method.isAnnotationPresent(PutMapping.class)) {
						httpMethod = "PUT";
						path = method.getAnnotation(PutMapping.class).value().length > 0
								? method.getAnnotation(PutMapping.class).value()[0]
								: "";
					} else if (method.isAnnotationPresent(DeleteMapping.class)) {
						httpMethod = "DELETE";
						path = method.getAnnotation(DeleteMapping.class).value().length > 0
								? method.getAnnotation(DeleteMapping.class).value()[0]
								: "";
					} else {
						continue;
					}

					String fullPath = (basePath + "/" + path).replaceAll("//+", "/");
					String feature = permissionUtils.extractFeatureFromPath(fullPath);
					String action = permissionUtils.mapHttpToAction(httpMethod);

					String label = feature + "." + action;
					if (!feature.equals("unknown") && !action.equals("unknown")
							&& seen.add(label) && !existingLabels.contains(label)) {
						System.out.println("✅ Nouvelle permission : " + label);
						newPermissions.add(Permission.builder().feature(feature).action(action).build());
					}
				}
			}

			if (!newPermissions.isEmpty()) {
				permissionRepository.saveAll(newPermissions);
			}

			PermissionList adminPL = permissionListRepository.findAll().stream()
					.filter(pl -> "ADMIN_PL".equals(pl.getName()))
					.findFirst()
					.orElseGet(() -> permissionListRepository.save(
							PermissionList.builder().name("ADMIN_PL").permissions(new HashSet<>()).build()
					));

			Set<String> existingPlLabels = adminPL.getPermissions().stream()
					.map(p -> p.getFeature() + "." + p.getAction())
					.collect(Collectors.toSet());

			List<Permission> allPermissions = permissionRepository.findAll();
			List<Permission> missingPermissions = allPermissions.stream()
					.filter(p -> !existingPlLabels.contains(p.getFeature() + "." + p.getAction()))
					.toList();

			if (!missingPermissions.isEmpty()) {
				adminPL.getPermissions().addAll(missingPermissions);
				permissionListRepository.save(adminPL);
			}

			Role adminRole = roleRepository.findByName("ADMIN")
					.orElseGet(() -> roleRepository.save(
							Role.builder().name("ADMIN").permissionLists(new ArrayList<>()).build()
					));

			if (adminRole.getPermissionLists().stream().noneMatch(pl -> "ADMIN_PL".equals(pl.getName()))) {
				adminRole.getPermissionLists().add(adminPL);
				roleRepository.save(adminRole);
			}

			User admin = userRepository.findByEmail("admin@gmail.com")
					.orElseGet(() -> userRepository.save(
							User.builder()
									.email("admin@gmail.com")
									.firstname("Admin")
									.lastname("User")
									.password(passwordEncoder.encode("admin123"))
									.enabled(true)
									.account_locked(false)
									.roles(new HashSet<>())
									.tokens(new ArrayList<>()) // ✅ ADD THIS LINE
									.build()
					));


			if (admin.getRoles().stream().noneMatch(r -> "ADMIN".equals(r.getName()))) {
				admin.getRoles().add(adminRole);
				userRepository.save(admin);
			}

			System.out.println("🎉 Initialisation terminée avec succès.");
		};
	}
}
