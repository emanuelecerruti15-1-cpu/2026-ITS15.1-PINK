package model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu")
public class Piatto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID auto-incrementale
    @Column(name="id_piatto")
    private Long id;

    @Column(name="nome", nullable = false, unique = true)
    private String nome;

    @Column(name="prezzo")
    private double prezzo;

    @Column(name="disponibile")
    private boolean disponibile;


    // FONDAMENTALE: Costruttore vuoto obbligatorio richiesto da JPA
    public Piatto() {
    }

    // Il tuo costruttore completo (rimane invariato)
    public Piatto(Long id, String nome, double prezzo, boolean disponibile) {
        this.id = id;
        this.nome = nome;
        this.prezzo = prezzo;
        this.disponibile = disponibile;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(double prezzo) {
        this.prezzo = prezzo;
    }

    public boolean isDisponibile() {
        return disponibile;
    }

    public void setDisponibile(boolean disponibile) {
        this.disponibile = disponibile;
    }
}