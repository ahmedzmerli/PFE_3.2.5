package com.example.GestionUser.repositories;

import com.example.GestionUser.entities.PdvMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PdvMasterRepository extends JpaRepository<PdvMaster, String> {
    Optional<PdvMaster> findByMsisdn(String msisdn);

}
