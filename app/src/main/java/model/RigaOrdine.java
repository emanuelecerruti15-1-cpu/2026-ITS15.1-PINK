package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "righe_ordine")
public class RigaOrdine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID automatico incrementale
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_ordine")
    @JsonIgnore
    private Ordine ordine;

    @Column(name = "piatto_id")
    private Long piattoId;

    @Column(name = "nome_piatto")
    private String nome;

    @Column(name = "quantita")
    private int quantita;

    @Column(name = "prezzo")
    private double prezzoUnitario;

    // FONDAMENTALE: Costruttore vuoto obbligatorio per JPA
    public RigaOrdine() {
    }

    // Il tuo costruttore completo (rimane invariato)
    public RigaOrdine(Long id, Long piattoId, String nome, int quantita, double prezzoUnitario) {
        this.id = id;
        this.piattoId = piattoId;
        this.nome = nome;
        this.quantita = quantita;
        this.prezzoUnitario = prezzoUnitario;
    }


    public Long getId() {
        return id;
    }

    public Long getPiattoId() {
        return piattoId;
    }

    public String getNome() {
        return nome;
    }

    public int getQuantita() {
        return quantita;
    }

    public double getPrezzoUnitario() {
        return prezzoUnitario;
    }

    // Questo metodo calcola il totale al volo senza salvare colonne duplicate nel DB
    public double getTotale() {
        return prezzoUnitario * quantita;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPiattoId(Long piattoId) {
        this.piattoId = piattoId;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setQuantita(int quantita) {
        this.quantita = quantita;
    }

    public void setPrezzoUnitario(double prezzoUnitario) {
        this.prezzoUnitario = prezzoUnitario;
    }


    public Ordine getOrdine(){
        return ordine;
    }


    public void setOrdine(Ordine ordine){
        this.ordine = ordine;
    }

}