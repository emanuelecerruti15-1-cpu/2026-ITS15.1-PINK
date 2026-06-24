package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordini")
public class Ordine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ordine")
    private Long id;

    @Column(name = "id_tavolo")
    private Long tavoloId;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato")
    private StatoOrdine stato;

    @Column(name = "creato_il", nullable = false)
    private LocalDateTime creato;

    @Column(name = "pagato_il")
    private LocalDateTime pagatoIl;


    // Costruttore vuoto obbligatorio per JPA
    public Ordine() {

    }

    // Costruttore principale
    public Ordine(Long id, Long tavoloId) {
        this.id = id;
        this.tavoloId = tavoloId;
        this.stato = StatoOrdine.APERTO;
        this.creato = LocalDateTime.now();
        //this.pagato = LocalDateTime.now(); // Inizializza anche questa così MySQL è contento -> sarebbe pagato_il
    }

    // GETTER E SETTER
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTavoloId() { return tavoloId; }
    public void setTavoloId(Long tavoloId) { this.tavoloId = tavoloId; }

    public StatoOrdine getStato() { return stato; }
    public void setStato(StatoOrdine stato) { this.stato = stato; }

    public LocalDateTime getCreatoIl() { return creato; }
    public void setCreatoIl(LocalDateTime creatoIl) { this.creato = creatoIl; }


    public double getTotale() {
        return 0.0;
    }


    public LocalDateTime getPagatoIl(){
        return pagatoIl;
    }


    public void setPagatoIl(LocalDateTime pagatoIl){
        this.pagatoIl = pagatoIl;
    }

}