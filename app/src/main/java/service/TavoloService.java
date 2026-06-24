package service;

import java.util.List;
import model.FormaTavolo;
import model.StatoTavolo;
import model.Tavolo;
import org.springframework.stereotype.Service;
import repository.TavoloRepository;

/**
 * Service per la gestione dei tavoli collegato al Database.
 */
@Service
public class TavoloService {

    private final TavoloRepository tavoloRepository;

    public TavoloService(TavoloRepository tavoloRepository) {
        this.tavoloRepository = tavoloRepository;
    }

    /**
     * Crea un nuovo tavolo e lo aggiunge alla tabella nel database.
     */
    public Tavolo creaTavolo(int numero, int posti, FormaTavolo forma) {
        // ID 0 perché è auto-incrementale nel DB
        Tavolo nuovoTavolo = new Tavolo(0, numero, posti, forma, StatoTavolo.LIBERO);
        return tavoloRepository.save(nuovoTavolo);
    }

    /**
     * Restituisce tutti i tavoli presenti leggendoli dal DB.
     */
    public List<Tavolo> getTuttiITavoli() {
        return tavoloRepository.findAll();
    }

    /**
     * Cerca un tavolo tramite id.
     */
    public Tavolo getTavoloById(int id) {
        // Cast a Long necessario se la repository usa Long come chiave
        return tavoloRepository.findById((long) id).orElse(null);
    }

    /**
     * Rende occupato un tavolo.
     */
    public Tavolo rendiOccupato(int id) {
        Tavolo tavolo = getTavoloById(id);
        if (tavolo == null) return null;

        tavolo.rendiOccupato();
        return tavoloRepository.save(tavolo);
    }

    /**
     * Rende libero un tavolo.
     */
    public Tavolo rendiLibero(int id) {
        Tavolo tavolo = getTavoloById(id);
        if (tavolo == null) return null;

        tavolo.rendiLibero();
        return tavoloRepository.save(tavolo);
    }

    /**
     * Rende prenotato un tavolo.
     */
    public Tavolo rendiPrenotato(int id) {
        Tavolo tavolo = getTavoloById(id);
        if (tavolo == null) return null;

        tavolo.rendiPrenotato();
        return tavoloRepository.save(tavolo);
    }

    /**
     * Rende non disponibile un tavolo.
     */
    public Tavolo rendiNonDisponibile(int id) {
        Tavolo tavolo = getTavoloById(id);
        if (tavolo == null) return null;

        tavolo.rendiNonDisponibile();
        return tavoloRepository.save(tavolo);
    }

    /**
     * Controlla se un tavolo può ospitare un certo numero di persone.
     */
    public boolean tavoloDisponibilePerPersone(int id, int persone) {
        Tavolo tavolo = getTavoloById(id);
        if (tavolo == null) return false;

        return tavolo.isLibero()
                && tavolo.haAbbastanzaPosti(persone)
                && !tavolo.isNonDisponibileStato();
    }
}