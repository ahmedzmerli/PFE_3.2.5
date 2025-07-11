package com.example.GestionUser.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.GestionUser.repositories",    // UNIQUEMENT ce package
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.REGEX,
                pattern = "com\\.example\\.GestionUser\\.repositories\\.jim\\..*"
        ),
        entityManagerFactoryRef = "mainEntityManagerFactory",
        transactionManagerRef = "mainTransactionManager"
)
public class MainDataSourceConfig {

    @Primary
    @Bean(name = "mainDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource mainDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "mainEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean mainEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("mainDataSource") DataSource mainDataSource
    ) {
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
        return builder
                .dataSource(mainDataSource)
                .packages("com.example.GestionUser.entities")  // <-- package de toutes tes entités BL_HISTORY, User, etc.
                .persistenceUnit("main")
                .properties(properties)
                .build();
    }

    @Primary
    @Bean(name = "mainTransactionManager")
    public PlatformTransactionManager mainTransactionManager(
            @Qualifier("mainEntityManagerFactory") jakarta.persistence.EntityManagerFactory mainEntityManagerFactory
    ) {
        return new JpaTransactionManager(mainEntityManagerFactory);
    }
}


//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.example.GestionUser.repositories",
//        excludeFilters = @ComponentScan.Filter(
//                type = FilterType.REGEX,
//                pattern = "com\\.example\\.GestionUser\\.repositories\\.jim\\..*"
//        ),
//        entityManagerFactoryRef = "mainEntityManagerFactory",
//        transactionManagerRef = "mainTransactionManager"
//)
//public class MainDataSourceConfig {
//
//    @Primary
//    @Bean(name = "mainDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource")
//    public DataSource mainDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    @Primary
//    @Bean(name = "mainEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean mainEntityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("mainDataSource") DataSource mainDataSource
//    ) {
//        return builder
//                .dataSource(mainDataSource)
//                .packages("com.example.GestionUser.entities")
//                .persistenceUnit("main")
//                .build();
//    }
//
//    @Primary
//    @Bean(name = "mainTransactionManager")
//    public PlatformTransactionManager mainTransactionManager(
//            @Qualifier("mainEntityManagerFactory") jakarta.persistence.EntityManagerFactory mainEntityManagerFactory
//    ) {
//        return new JpaTransactionManager(mainEntityManagerFactory);
//    }
//}
