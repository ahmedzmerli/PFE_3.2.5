package com.example.GestionUser.repositories;




import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.GestionUser.entities.BlHistory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface BlHistoryRepository extends JpaRepository<BlHistory, Long> {
    List<BlHistory> findByMsisdn(String msisdn);
//    List<BlHistory> findByMsisdnAndDateActionBetween(String msisdn, LocalDateTime start, LocalDateTime end);
//    //@Query pour blacklist
//    //@Query pour historique


    /**
     * Hibernate traduit ce between en
     *   MySQL : WHERE date_action BETWEEN ? AND ?
     *   Oracle : WHERE DATE_ACTION BETWEEN ? AND ?
     */
    List<BlHistory> findByMsisdnAndDateActionBetween(
            String msisdn,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
    SELECT b 
      FROM BlHistory b
     WHERE b.msisdn = :msisdn
       AND b.dateAction >= :start
       AND b.dateAction <  :end
    """)
    List<BlHistory> searchHistory(
            @Param("msisdn") String msisdn,
            @Param("start")  LocalDateTime start,
            @Param("end")    LocalDateTime end
    );



    @Query(value = "SELECT DATE_FORMAT(b.date_action, '%Y-%m') AS mois, COUNT(*) AS count " +
            "FROM BL_HISTORY  b " +
            "WHERE b.statubl = 'BLACKLISTED' AND b.date_action >= :start " +
            "GROUP BY mois ORDER BY mois", nativeQuery = true)
    List<Map<String, Object>> countBlacklistByMonth(@Param("start") LocalDateTime start);



    @Query(value = "SELECT b.segment AS segment, COUNT(*) AS count " +
            "FROM BL_HISTORY  b " +
            "WHERE b.STATUBL = 'BLACKLISTED' " + //BETWEEN :start AND :end " +
            "GROUP BY b.segment ORDER BY count DESC", nativeQuery = true)
    List<Map<String, Object>> countBlacklistBySegment();


    @Query(value = "SELECT DATE_FORMAT(b.date_action, '%Y-%m') AS mois, COUNT(*) AS count " +
            "FROM BL_HISTORY  b " +
            "WHERE b.STATUBL = 'WHITELISTED' AND b.date_action >= :start " +
            "GROUP BY mois ORDER BY mois", nativeQuery = true)
    List<Map<String, Object>> countWhitelistedByMonth(@Param("start") LocalDateTime start);

    @Query(value = "SELECT b.username AS username, COUNT(*) AS count " +
            "FROM BL_HISTORY  b " +
            "WHERE b.STATUBL = 'BLACKLISTED' " +
            "GROUP BY b.username ORDER BY count DESC", nativeQuery = true)
    List<Map<String, Object>> countBlacklistByUser();



}
