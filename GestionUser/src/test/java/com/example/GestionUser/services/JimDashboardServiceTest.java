package com.example.GestionUser.services;

import com.example.GestionUser.entities.jim.JimDashboard;
import com.example.GestionUser.repositories.jim.JimDashboardRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JimDashboardServiceTest {

    private JimDashboardRepository repo;
    private EntityManager entityManager;
    private JimDashboardService service;

    @BeforeEach
    void setUp() {
        repo = mock(JimDashboardRepository.class);
        entityManager = mock(EntityManager.class);
        service = new JimDashboardService(repo);
        service.setEntityManager(entityManager);
    }

    @Test
    void searchDashboard_shouldReturnResults() {
        // Mocks Criteria API
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<JimDashboard> cq = mock(CriteriaQuery.class);
        Root<JimDashboard> root = mock(Root.class);
        Predicate pred1 = mock(Predicate.class);
        Predicate pred2 = mock(Predicate.class);
        Predicate pred3 = mock(Predicate.class);
        Predicate pred4 = mock(Predicate.class);
        Predicate andPredicate = mock(Predicate.class);
        Path datePath = mock(Path.class);
        TypedQuery<JimDashboard> typedQuery = mock(TypedQuery.class);

        when(entityManager.getCriteriaBuilder()).thenReturn(cb);
        when(cb.createQuery(JimDashboard.class)).thenReturn(cq);
        when(cq.from(JimDashboard.class)).thenReturn(root);

        when(cb.equal(root.get("NUM_CLIENT"), "123")).thenReturn(pred1);
        when(cb.equal(root.get("HOTLINE"), "hotline")).thenReturn(pred2);

        when(root.get("DATE_HEURS")).thenReturn(datePath);

        when(cb.greaterThanOrEqualTo(any(Expression.class), any(LocalDateTime.class))).thenReturn(pred3);
        when(cb.lessThanOrEqualTo(any(Expression.class), any(LocalDateTime.class))).thenReturn(pred4);

        when(cb.and(any(Predicate[].class))).thenReturn(andPredicate);

        when(entityManager.createQuery(cq)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(List.of(new JimDashboard()));

        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now();

        List<JimDashboard> results = service.searchDashboard("123", "hotline", start, end);

        assertThat(results).hasSize(1);
        verify(entityManager).createQuery(cq);
        verify(typedQuery).getResultList();
    }
}
