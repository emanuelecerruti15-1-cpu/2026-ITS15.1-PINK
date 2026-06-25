package model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "prenotazioni")
public class Prenotazioni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prenotazione")
    private int id;

    @Column(name = "id_tavolo")
    private int idTavolo;

    @Column(name = "nome_cliente", nullable = false)
    private String nomeCliente;

    @Column(name = "email")
    private String email;

    @Column(name = "data_ora")
    private LocalDateTime dataOra;

    @Column(name = "numero_persone")
    private int numeroPersone;

    @Column(name = "note")
    private String note;

    @Column(name = "totale")
    private double totale;

    // FONDAMENTALE: Costruttore vuoto per JPA
    public Prenotazioni() {
    }

    // Costruttore coerente aggiornato ai veri campi del DB
    public Prenotazioni(int id, int idTavolo, String nomeCliente, String email, LocalDateTime dataOra, int numeroPersone, String note, double totale) {
        this.id = id;
        this.idTavolo = idTavolo;
        this.nomeCliente = nomeCliente;
        this.email = email;
        this.dataOra = dataOra;
        this.numeroPersone = numeroPersone;
        this.note = note;
        this.totale = totale;
    }


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getIdTavolo() { return idTavolo; }
    public void setIdTavolo(int idTavolo) { this.idTavolo = idTavolo; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getDataOra() { return dataOra; }
    public void setDataOra(LocalDateTime dataOra) { this.dataOra = dataOra; }

    public int getNumeroPersone() { return numeroPersone; }
    public void setNumeroPersone(int numeroPersone) { this.numeroPersone = numeroPersone; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public double getTotale() { return totale; }
    public void setTotale(double totale) { this.totale = totale; }
}