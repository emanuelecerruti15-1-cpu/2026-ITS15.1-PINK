/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.gestionaleristorante;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


/**
 * Classe principale del gestionale.
 *
 * Questa classe serve ad avviare Spring Boot.
 * Quando viene avviata, rende disponibili le API del backend,
 * ad esempio:
 *
 * http://localhost:8080/api/piatti
 */
@SpringBootApplication(scanBasePackages = {
    "com.mycompany.gestionaleristorante",
    "controller",
    "service",
    "model",
    "repository"
})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = "model")
public class GestionaleRistoranteApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionaleRistoranteApplication.class, args);
    }
}