package controller;

import model.PrenotazioneDTO;
import model.Prenotazioni;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.PrenotazioniRepository;
import service.PrenotazioneService;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/prenotazioni")
@CrossOrigin(origins = "*")
public class PrenotazioniController {

    private final PrenotazioneService prenotazioneService;
    private final PrenotazioniRepository prenotazioneRepository;


    public PrenotazioniController(PrenotazioneService prenotazioneService,
                                  PrenotazioniRepository prenotazioneRepository) {
        this.prenotazioneService = prenotazioneService;
        this.prenotazioneRepository = prenotazioneRepository; // INIZIALIZZAZIONE!
    }

    @GetMapping("/{id}")
    public Prenotazioni getPrenotazioneById(@PathVariable("id") int id) { // int
        return prenotazioneService.getOrdinazioniById(id);
    }

    @PostMapping
    public ResponseEntity<?> creaPrenotazione(@RequestBody PrenotazioneDTO dto) {
        Prenotazioni p = new Prenotazioni();
        p.setNomeCliente(dto.nome);
        p.setNumeroPersone(dto.persone);

        // Assicurati che dto.data e dto.ora arrivino nel formato corretto
        // Es: data="2026-06-25", ora="23:00" -> "2026-06-25T23:00"
        p.setDataOra(LocalDateTime.parse(dto.data + "T" + dto.ora));
        p.setIdTavolo(dto.tavoloId != null ? dto.tavoloId : 0);


        prenotazioneRepository.save(p);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public Prenotazioni modificaPrenotazione(@PathVariable("id") int id, @RequestBody Prenotazioni p) {
        return prenotazioneService.modificaOrdine(
                id,
                p.getIdTavolo(),
                p.getNomeCliente(),
                p.getEmail(),
                p.getDataOra().toLocalDate(),
                p.getDataOra().toLocalTime(),
                p.getNumeroPersone(),
                p.getNote(),
                p.getTotale()
        );
    }

    @DeleteMapping("/{id}")
    public void eliminaPrenotazione(@PathVariable("id") int id) { // int
        prenotazioneService.eliminaPrenotazione(id);
    }


    @GetMapping
    public List<Prenotazioni> getTutteLePrenotazioni() {
        return prenotazioneService.getTuttiOrdini();
    }
}