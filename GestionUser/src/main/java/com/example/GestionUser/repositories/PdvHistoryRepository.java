package com.example.GestionUser.repositories;


import com.example.GestionUser.entities.PdvHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PdvHistoryRepository extends JpaRepository<PdvHistory, Long> {
//    List<PdvHistory> findByMsisdn(String msisdn);
}
