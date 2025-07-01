package com.example.GestionUser.repositories;

import com.example.GestionUser.entities.Token;
import com.example.GestionUser.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Optional<Token> findByToken(String token);
    Optional<Token> findTopByUserOrderByCreatedAtDesc(User user);

}
