package com.example.GestionUser.repositories;

import com.example.GestionUser.entities.Pdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PdvRepository extends JpaRepository<Pdv, String> {
}
