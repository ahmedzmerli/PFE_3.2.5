package com.example.GestionUser.auth;

import com.example.GestionUser.entities.Token;
import com.example.GestionUser.entities.User;
import com.example.GestionUser.handler.BusinessErrorCodes;
import com.example.GestionUser.handler.BusinessException;
import com.example.GestionUser.repositories.RoleRepository;
import com.example.GestionUser.repositories.TokenRepository;
import com.example.GestionUser.repositories.UserRepository;
import com.example.GestionUser.security.JwtService;
import com.example.GestionUser.services.EmailService;
import com.example.GestionUser.services.EmailTemplateName;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegistrationRequest request) throws MessagingException {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException(BusinessErrorCodes.EMAIL_ALREADY_EXISTS);
        }
//        var userRole = roleRepository.findByName("USER")
//                // todo - better exception handling
//                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .account_locked(false)
                .enabled(false)
//                .roles(Set.of(userRole))
                .build();
        userRepository.save(user);
        sendValidationEmail(user);
    }


    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 🔄 Recharger l'utilisateur avec ses rôles + permissionLists + permissions
        var user = userRepository.findByEmail(request.getEmail())
                .map(u -> {
                    u.getRoles().forEach(role -> {
                        role.getPermissionLists().forEach(pl -> {
                            pl.getPermissions().size(); // Force le chargement
                        });
                    });
                    return u;
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Extraire toutes les permissions au format feature.action
        Set<String> allPermissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissionLists().stream())
                .flatMap(pl -> pl.getPermissions().stream())
                .map(p -> p.getFeature() + "." + p.getAction())
                .collect(Collectors.toSet());

        // 🔐 Ajouter dans le token
        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getFullName());
        claims.put("authorities", allPermissions);

        var jwtToken = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                // todo exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid token"));

                if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
                    sendValidationEmail(savedToken.getUser());
                    throw new BusinessException(BusinessErrorCodes.TOKEN_EXPIRED);
                }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    public void resendActivationToken(String email) throws MessagingException {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.ACCOUNT_NOT_FOUND, "Aucun compte avec cet email"));
    
        if (user.isEnabled()) {
            throw new BusinessException(BusinessErrorCodes.ACCOUNT_ALREADY_ACTIVATED, "Le compte est déjà activé");
        }
    
        var lastToken = tokenRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
        if (lastToken != null && lastToken.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(30))) {
            throw new BusinessException(BusinessErrorCodes.TOKEN_ALREADY_SENT, "Veuillez patienter avant de redemander un code.");
        }
    
        sendValidationEmail(user);
    }

    public void resendToken(String email) throws MessagingException {
    var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException(BusinessErrorCodes.USER_NOT_FOUND, "Aucun utilisateur associé à cet email"));

    if (user.isEnabled()) {
        throw new BusinessException(BusinessErrorCodes.ACCOUNT_ALREADY_ACTIVATED, "Ce compte est déjà activé.");
    }
    
    log.info("Resending activation email to {}", user.getEmail());


    sendValidationEmail(user);
}



    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(BusinessErrorCodes.USER_NOT_FOUND, "Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException(BusinessErrorCodes.INVALID_PASSWORD, "Ancien mot de passe incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    
}
