package com.example.GestionUser.config;

import java.util.HashMap;
import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.GestionUser.repositories.jim",     // <-- le package de tes repos JimDashboard
        entityManagerFactoryRef = "jimEntityManagerFactory",
        transactionManagerRef = "jimTransactionManager"
)
public class JimDashboardDataSourceConfig {

    @Bean(name = "jimDataSource")
    @ConfigurationProperties(prefix = "spring.jimdashboard.datasource")
    public DataSource jimDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "jimEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean jimEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("jimDataSource") DataSource jimDataSource
    ) {
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");// change selon ta base
        return builder
                .dataSource(jimDataSource)
                .packages("com.example.GestionUser.entities.jim")  // <-- package de l'entité JimDashboard
                .persistenceUnit("jimDashboard")
                .properties(properties)
                .build();
    }

    @Bean(name = "jimTransactionManager")
    public PlatformTransactionManager jimTransactionManager(
            @Qualifier("jimEntityManagerFactory") EntityManagerFactory jimEntityManagerFactory
    ) {
        return new JpaTransactionManager(jimEntityManagerFactory);
    }
}


//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.example.GestionUser.repositories.jim",
//        entityManagerFactoryRef = "jimEntityManagerFactory",
//        transactionManagerRef = "jimTransactionManager"
//)
//public class JimDashboardDataSourceConfig {
//
//    @Bean(name = "jimDataSource")
//    @ConfigurationProperties(prefix = "spring.jimdashboard.datasource")
//    public DataSource jimDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    @Bean(name = "jimEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean jimEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("jimDataSource") DataSource jimDataSource
//    ) {
//        HashMap<String, Object> properties = new HashMap<>();
//
//        String activeProfile = System.getProperty("spring.profiles.active");
//        if ("test".equals(activeProfile)) {
//            properties.put("hibernate.hbm2ddl.auto", "create-drop");
//            properties.put("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
//        } else {
//            properties.put("hibernate.hbm2ddl.auto", "update");
//            properties.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
//        }
//
//        return builder
//                .dataSource(jimDataSource)
//                .packages("com.example.GestionUser.entities.jim")
//                .persistenceUnit("jimDashboard")
//                .properties(properties)
//                .build();
//    }
//
//    @Bean(name = "jimTransactionManager")
//    public PlatformTransactionManager jimTransactionManager(
//            @Qualifier("jimEntityManagerFactory") EntityManagerFactory jimEntityManagerFactory
//    ) {
//        return new JpaTransactionManager(jimEntityManagerFactory);
//    }
//}
