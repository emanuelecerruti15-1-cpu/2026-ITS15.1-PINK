package model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tavoli")
public class Tavolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tavolo")
    private int id;

    @Column(name = "tavolo", unique = true, nullable = false)
    private int numero;

    @Column(name = "capacita_posti")
    private int posti;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma")
    private FormaTavolo forma;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato")
    private StatoTavolo stato;

    @Column(name = "disponibilita") // 1 = Disponibile, 0 = Non Disponibile (es. rotto)
    private int disponibilita;

    // FONDAMENTALE: Costruttore vuoto obbligatorio per JPA
    public Tavolo() {
    }

    // Costruttore completo coerente con le nuove logiche
    public Tavolo(int id, int numero, int posti, FormaTavolo forma, StatoTavolo stato) {
        this.id = id;
        this.numero = numero;
        this.posti = posti;
        this.forma = forma;
        this.stato = stato;
        // Se lo stato iniziale è LIBERO, OCCUPATO o PRENOTATO il tavolo è disponibile (1), altrimenti se è rotto/fuori uso è 0
        this.disponibilita = (stato == StatoTavolo.NON_DISPONIBILE) ? 0 : 1;
    }

    // GETTER E SETTER
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }

    public int getPosti() { return posti; }
    public void setPosti(int posti) { this.posti = posti; }

    public FormaTavolo getForma() { return forma; }
    public void setForma(FormaTavolo forma) { this.forma = forma; }

    public StatoTavolo getStato() { return stato; }
    public void setStato(StatoTavolo stato) {
        this.stato = stato;
        // Aggiorna automaticamente la disponibilità numerica quando cambia lo stato
        this.disponibilita = (stato == StatoTavolo.NON_DISPONIBILE) ? 0 : 1;
    }

    public int getDisponibilita() { return disponibilita; }
    public void setDisponibilita(int disponibilita) { this.disponibilita = disponibilita; }


    // METODI DI LOGICA DI BUSINESS RIVISTI E COERENTI

    public boolean isLibero() {
        return this.stato == StatoTavolo.LIBERO;
    }

    public boolean isOccupato() {
        return this.stato == StatoTavolo.OCCUPATO;
    }

    public boolean isPrenotato() {
        return this.stato == StatoTavolo.PRENOTATO;
    }

    public boolean isNonDisponibileStato() {
        // Un tavolo non è disponibile se lo stato è impostato su NON_DISPONIBILE o se la colonna disponibilità è 0
        return this.stato == StatoTavolo.NON_DISPONIBILE || this.disponibilita == 0;
    }

    public void rendiLibero() {
        this.stato = StatoTavolo.LIBERO;
        this.disponibilita = 1;
    }

    public void rendiOccupato() {
        this.stato = StatoTavolo.OCCUPATO;
        this.disponibilita = 1;
    }

    public void rendiPrenotato() {
        this.stato = StatoTavolo.PRENOTATO;
        this.disponibilita = 1;
    }

    public void rendiNonDisponibile() {
        this.stato = StatoTavolo.NON_DISPONIBILE;
        this.disponibilita = 0; // Tavolo rotto/fuori servizio
    }

    public boolean haAbbastanzaPosti(int persone) {
        return persone > 0 && this.posti >= persone;
    }
}