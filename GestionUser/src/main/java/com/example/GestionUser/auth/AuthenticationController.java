package com.example.GestionUser.auth;

//import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
//@RequestMapping("auth")
@RequestMapping("/api/v1/auth")

@RequiredArgsConstructor
//@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public ResponseEntity<?> confirm(@RequestParam String token) throws MessagingException {
        service.activateAccount(token);
        // Message de succès (en JSON, c'est mieux)
        return ResponseEntity.ok(
                Map.of(
                        "message", "Votre compte a bien été activé! Vous pouvez maintenant vous connecter."
                )
        );
    }


    @PostMapping("/resend-token")
public ResponseEntity<?> resendActivationCode(@RequestParam String email) throws MessagingException {
    service.resendToken(email);
    return ResponseEntity.ok().build();
}



    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid ChangePasswordRequest request,
            Principal connectedUser
    ) {
        service.changePassword(connectedUser.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Mot de passe changé avec succès"));
    }


}