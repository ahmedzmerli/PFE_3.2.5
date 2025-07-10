package com.example.GestionUser.services;




import com.example.GestionUser.entities.jim.JimDashboard;
import com.example.GestionUser.repositories.jim.JimDashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JimDashboardService {

    private final JimDashboardRepository repo;

    @PersistenceContext
    private EntityManager entityManager;

    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }


    public List<JimDashboard> searchDashboard(
            String msisdn,
            String hotline,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<JimDashboard> cq = cb.createQuery(JimDashboard.class);
        Root<JimDashboard> root = cq.from(JimDashboard.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.equal(root.get("NUM_CLIENT"), msisdn));
        predicates.add(cb.equal(root.get("HOTLINE"), hotline));

        if (startDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("DATE_HEURS"), startDate));
        }
        if (endDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("DATE_HEURS"), endDate));
        }
        cq.where(cb.and(predicates.toArray(new Predicate[0])));

        TypedQuery<JimDashboard> query = entityManager.createQuery(cq);
        return query.getResultList();
    }


//    public List<JimDashboard> searchDashboard( Après intégration du Query
//            String msisdn,
//            String hotline,
//            LocalDateTime startDate,
//            LocalDateTime endDate
//    ) {
//        return repo.fetchDashboardData(msisdn, hotline, startDate, endDate);
//    }

}

