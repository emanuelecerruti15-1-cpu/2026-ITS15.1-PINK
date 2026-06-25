package service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import model.Piatto;
import org.springframework.stereotype.Service;
import repository.PiattoRepository; // Inseriamo la Repository

@Service
public class PiattoService {

    // 1. Iniettiamo la Repository al posto della vecchia lista in memoria
    private final PiattoRepository piattoRepository;

    public PiattoService(PiattoRepository piattoRepository) {
        this.piattoRepository = piattoRepository;
    }

    /**
     * Sostituisce il vecchio costruttore.
     * All'avvio del server, se la tabella dei piatti è vuota, inserisce i piatti di esempio.
     */
    @PostConstruct
    public void inizializzaMenu() {
        if (piattoRepository.count() == 0) { // Controlla se il DB è vuoto
            creaPiatto("Pizza Margherita", 8.00, true);
            creaPiatto("Spaghetti Carbonara", 12.00, true);
            creaPiatto("Tiramisù", 6.00, true);
        }
    }

    /**
     * Restituisce tutti i piatti presenti nel menu leggendoli dal DB.
     */
    public List<Piatto> getTuttiIPiatti() {
        return piattoRepository.findAll(); // Usa JPA per fare la SELECT *
    }

    /**
     * Cerca un piatto tramite il suo id nel DB.
     */
    public Piatto getPiattoById(Long id) {
        // Cerca per ID, se non lo trova lancia l'eccezione come facevi prima
        return piattoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Piatto non trovato con id: " + id));
    }

    /**
     * Crea un nuovo piatto e lo salva fisicamente nel database.
     */
    public Piatto creaPiatto(String nome, double prezzo, boolean disponibile) {
        // Manteniamo i tuoi controlli di sicurezza (validazioni)
        validaNome(nome);
        validaPrezzo(prezzo);

        // Creiamo l'oggetto (Non serve gestire 'prossimoId', ci pensa il DB con l'Id incrementale!)
        Piatto nuovoPiatto = new Piatto();
        nuovoPiatto.setNome(nome);
        nuovoPiatto.setPrezzo(prezzo);
        nuovoPiatto.setDisponibile(disponibile);

        // Salva nel database (fa una INSERT SQL)
        return piattoRepository.save(nuovoPiatto);
    }

    /**
     * Modifica un piatto già esistente nel DB.
     */
    public Piatto modificaPiatto(Long id, String nome, double prezzo, boolean disponibile) {
        validaNome(nome);
        validaPrezzo(prezzo);

        // Cerco il piatto esistente nel DB
        Piatto piatto = getPiattoById(id);

        // Aggiorno i campi
        piatto.setNome(nome);
        piatto.setPrezzo(prezzo);
        piatto.setDisponibile(disponibile);

        // Salvo le modifiche nel database (fa una UPDATE SQL)
        return piattoRepository.save(piatto);
    }

    /**
     * Elimina un piatto dal database.
     */
    public void eliminaPiatto(Long id) {
        // Cerco il piatto per essere sicuri che esista
        Piatto piatto = getPiattoById(id);

        // Rimuovo dal database (fa una DELETE SQL)
        piattoRepository.delete(piatto);
    }

    /**
     * Cambia la disponibilità di un piatto nel DB.
     */
    public Piatto cambiaDisponibilita(Long id, boolean disponibile) {
        Piatto piatto = getPiattoById(id);
        piatto.setDisponibile(disponibile);
        return piattoRepository.save(piatto); // Aggiorna sul DB
    }

    /**
     * Controlla se un piatto può essere ordinato.
     */
    public boolean piattoDisponibile(Long id) {
        Piatto piatto = getPiattoById(id);
        return piatto.isDisponibile();
    }


    private void validaNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Il nome del piatto è obbligatorio.");
        }
    }

    private void validaPrezzo(double prezzo) {
        if (prezzo <= 0) {
            throw new IllegalArgumentException("Il prezzo del piatto deve essere maggiore di zero.");
        }
    }
}