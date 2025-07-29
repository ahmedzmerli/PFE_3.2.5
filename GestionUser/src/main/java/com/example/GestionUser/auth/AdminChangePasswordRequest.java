package com.example.GestionUser.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminChangePasswordRequest {

    @NotBlank
    private String newPassword;
}
