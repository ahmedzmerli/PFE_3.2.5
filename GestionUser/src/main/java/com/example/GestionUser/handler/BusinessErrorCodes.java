package com.example.GestionUser.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

public enum BusinessErrorCodes {
    // Généraux
    NO_CODE(0, NOT_IMPLEMENTED, "No code"),

    // 🔐 Auth
    INCORRECT_CURRENT_PASSWORD(300, BAD_REQUEST, "Current password is incorrect"),
    NEW_PASSWORD_DOES_NOT_MATCH(301, BAD_REQUEST, "The new password does not match"),
    ACCOUNT_LOCKED(302, FORBIDDEN, "User account is locked"),
    ACCOUNT_DISABLED(303, FORBIDDEN, "User account is disabled"),
    BAD_CREDENTIALS(304, FORBIDDEN, "Login and / or Password is incorrect"),

    // 👤 Utilisateur
    EMAIL_ALREADY_EXISTS(400, BAD_REQUEST, "Cet email est déjà utilisé."),
    ROLE_USER_NOT_FOUND(401, BAD_REQUEST, "Le rôle USER n'existe pas."),
    TOKEN_INVALID(402, BAD_REQUEST, "Le token d’activation est invalide."),
    TOKEN_EXPIRED(403, BAD_REQUEST, "Le token d’activation a expiré."),
    ACCOUNT_NOT_FOUND(405, BAD_REQUEST, "Le compte n'existe pas."),
    ACCOUNT_ALREADY_ACTIVATED(406, BAD_REQUEST, "Le compte est déjà activé."),
    TOKEN_ALREADY_SENT(407, BAD_REQUEST, "Le token a déjà été envoyé récemment."),
    USER_NOT_FOUND(408, BAD_REQUEST, "L'utilisateur n'existe pas."),

    // ✅ Permissions
    PERMISSION_LIST_NOT_FOUND(1001, NOT_FOUND, "La liste de permissions est introuvable."),
    PERMISSION_NOT_FOUND(1002, NOT_FOUND, "La permission est introuvable."),
    PERMISSION_LIST_EMPTY(1003, BAD_REQUEST, "La liste des permissions est vide."),
    PERMISSION_ALREADY_ASSIGNED(1004, BAD_REQUEST, "La permission est déjà assignée."),
    PERMISSION_NAME_REQUIRED(1005, BAD_REQUEST, "Le nom de la liste est requis."),

    // ✅ Rôles
    ROLE_ALREADY_EXISTS(1101, BAD_REQUEST, "Ce rôle existe déjà."),
    ROLE_NOT_FOUND(1102, NOT_FOUND, "Le rôle est introuvable."),
    ROLE_NAME_REQUIRED(1103, BAD_REQUEST, "Le nom du rôle est requis."),
    ROLE_UPDATE_FAILED(1104, BAD_REQUEST, "Échec de mise à jour du rôle."),
    ROLE_DELETE_FAILED(1105, INTERNAL_SERVER_ERROR, "Erreur lors de la suppression du rôle."),


    BLACKLIST_ENTRY_NOT_FOUND(1201, NOT_FOUND, "L'entrée de la blacklist est introuvable."),


    // 🔍 Historique
    BL_HISTORY_MSISDN_REQUIRED(6001, BAD_REQUEST, "Le champ MSISDN est requis pour la recherche dans l'historique."),

    // 📊 Jim Dashboard
    JIM_MSISDN_REQUIRED(7001, BAD_REQUEST, "Le champ msisdn est obligatoire."),
    JIM_HOTLINE_REQUIRED(7002, BAD_REQUEST, "Le champ hotline est obligatoire."),


    ;



    @Getter private final int code;
    @Getter private final String description;
    @Getter private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, HttpStatus status, String description) {
        this.code = code;
        this.httpStatus = status;
        this.description = description;
    }
}
