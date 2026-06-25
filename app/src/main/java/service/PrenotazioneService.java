package service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import model.Prenotazioni;
import model.Tavolo;
import org.springframework.stereotype.Service;
import repository.PrenotazioniRepository;

@Service
public class PrenotazioneService {

    private final PrenotazioniRepository prenotazioniRepository;
    private final TavoloService tavoloService;

    public PrenotazioneService(PrenotazioniRepository prenotazioniRepository, TavoloService tavoloService) {
        this.prenotazioniRepository = prenotazioniRepository;
        this.tavoloService = tavoloService;
    }

    /**
     * Restituisce tutte le prenotazioni leggendole dal DB.
     */
    public List<Prenotazioni> getTuttiOrdini() {
        return prenotazioniRepository.findAll();
    }

    /**
     * Cerca una prenotazione tramite il suo id nel DB.
     */
    public Prenotazioni getOrdinazioniById(int id) { // Cambiato in int
        return prenotazioniRepository.findById((long) id) // Cast a Long se la repository estende JpaRepository<Prenotazioni, Long>
                .orElseThrow(() -> new IllegalArgumentException("Prenotazione non trovata con id: " + id));
    }

    /**
     * Crea una nuova prenotazione e la salva sul DB.
     */
    public Prenotazioni creaOrdinazione(int tavoloId, String nome, String email, LocalDate data, LocalTime ora, int persone, String note, double totale) {
        validaNome(nome);
        validaPersone(persone);
        validaOra(ora);

        if (data == null) data = LocalDate.now();
        controllaTavoloPerPrenotazione(tavoloId, persone);

        LocalDateTime dataOraUnita = LocalDateTime.of(data, ora);

        Prenotazioni nuovaPrenotazione = new Prenotazioni();
        nuovaPrenotazione.setIdTavolo(tavoloId);
        nuovaPrenotazione.setNomeCliente(nome);
        nuovaPrenotazione.setEmail(email);
        nuovaPrenotazione.setNumeroPersone(persone);
        nuovaPrenotazione.setDataOra(dataOraUnita);
        nuovaPrenotazione.setNote(note);
        nuovaPrenotazione.setTotale(totale);

        Prenotazioni salvata = prenotazioniRepository.save(nuovaPrenotazione);

        if (tavoloId != 0) tavoloService.rendiPrenotato(tavoloId);
        return salvata;
    }

    public Prenotazioni modificaOrdine(int id, int tavoloId, String nome, String email, LocalDate data, LocalTime ora, int persone, String note, double totale) {
        Prenotazioni p = getOrdinazioniById(id);
        p.setIdTavolo(tavoloId);
        p.setNomeCliente(nome);
        p.setEmail(email);
        p.setDataOra(LocalDateTime.of(data, ora));
        p.setNumeroPersone(persone);
        p.setNote(note);
        p.setTotale(totale);

        return prenotazioniRepository.save(p);
    }

    /**
     * Modifica una prenotazione esistente nel DB.
     */
    public Prenotazioni modificaOrdine(int id, int tavoloId, String nome, int persone, LocalTime ora, LocalDate data, double totale) {
        validaNome(nome);
        validaPersone(persone);
        validaOra(ora);

        if (data == null) {
            data = LocalDate.now();
        }

        controllaTavoloPerPrenotazione(tavoloId, persone);

        Prenotazioni prenotazione = getOrdinazioniById(id);
        int vecchioTavoloId = prenotazione.getIdTavolo();

        if (vecchioTavoloId != 0 && vecchioTavoloId != tavoloId) {
            tavoloService.rendiLibero(vecchioTavoloId);
        }

        LocalDateTime dataOraUnita = LocalDateTime.of(data, ora);

        prenotazione.setIdTavolo(tavoloId);
        prenotazione.setNomeCliente(nome);
        prenotazione.setNumeroPersone(persone);
        prenotazione.setDataOra(dataOraUnita);
        prenotazione.setTotale(totale);

        if (tavoloId != 0) {
            tavoloService.rendiPrenotato(tavoloId);
        }

        return prenotazioniRepository.save(prenotazione);
    }

    /**
     * Elimina una prenotazione dal database.
     */
    public void eliminaPrenotazione(int id) {
        Prenotazioni prenotazione = getOrdinazioniById(id);
        int tavoloId = prenotazione.getIdTavolo();

        prenotazioniRepository.delete(prenotazione);

        if (tavoloId != 0) {
            tavoloService.rendiLibero(tavoloId);
        }
    }

    /**
     * Aggiorna il totale di una prenotazione.
     */
    public Prenotazioni cambiaTotale(int id, double totale) {
        Prenotazioni prenotazione = getOrdinazioniById(id);
        prenotazione.setTotale(totale);
        return prenotazioniRepository.save(prenotazione);
    }

    public Prenotazioni creaPrenotazione(int tavoloId, String nome, String email, LocalDate data, LocalTime ora, int persone, String note, double totale) {
        return creaOrdinazione(tavoloId, nome, email, data, ora, persone, note, totale);
    }

    public Prenotazioni modificaPrenotazione(int id, int tavoloId, String nome, String email, LocalDate data, LocalTime ora, int persone, String note, double totale) {
        Prenotazioni prenotazione = getOrdinazioniById(id);
        return modificaOrdine(id, prenotazione.getIdTavolo(), nome, persone, ora, data, totale);
    }

    private void controllaTavoloPerPrenotazione(int tavoloId, int persone) {
        if (tavoloId == 0) {
            return;
        }

        Tavolo tavolo = tavoloService.getTavoloById(tavoloId);

        if (tavolo == null) {
            throw new IllegalArgumentException("Tavolo non trovato con id: " + tavoloId);
        }

        if (!tavolo.haAbbastanzaPosti(persone)) {
            throw new IllegalArgumentException("Il tavolo non ha abbastanza posti.");
        }
    }

    private void validaNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Il nome è obbligatorio.");
        }
    }

    private void validaPersone(int persone) {
        if (persone <= 0) {
            throw new IllegalArgumentException("Il numero di persone deve essere maggiore di zero.");
        }
    }

    private void validaOra(LocalTime ora) {
        if (ora == null) {
            throw new IllegalArgumentException("L'orario è obbligatorio.");
        }

        LocalTime inizio = LocalTime.of(18, 30);
        LocalTime fine = LocalTime.of(23, 30);

        if (ora.isBefore(inizio) || ora.isAfter(fine)) {
            throw new IllegalArgumentException("L'orario deve essere compreso tra 18:30 e 23:30.");
        }
    }
}