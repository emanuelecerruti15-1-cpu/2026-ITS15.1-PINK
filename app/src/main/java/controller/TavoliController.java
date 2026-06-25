package controller;

import java.util.List;
import model.StatoTavolo;
import model.Tavolo;
import org.springframework.web.bind.annotation.*;
import service.TavoloService;

@RestController
@RequestMapping("/api/tavoli")
@CrossOrigin(origins = "*")
public class TavoliController {

    private final TavoloService tavoloService;

    public TavoliController(TavoloService tavoloService) {
        this.tavoloService = tavoloService;
    }

    // URL: GET /api/tavoli
    @GetMapping
    public List<Tavolo> getTuttiITavoli() {
        return tavoloService.getTuttiITavoli();
    }

    // URL: GET /api/tavoli/1
    // Ora accetta direttamente un int, niente più cast strani
    @GetMapping("/{id}")
    public Tavolo getTavoloById(@PathVariable("id") int id) {
        return tavoloService.getTavoloById(id);
    }

    // URL: PUT /api/tavoli/1/stato
    @PutMapping("/{id}/stato")
    public Tavolo cambiaStato(@PathVariable("id") int id, @RequestBody CambioStatoRequest request) {

        // La logica ora usa direttamente l'id int
        switch (request.getStato()) {
            case LIBERO:
                return tavoloService.rendiLibero(id);
            case OCCUPATO:
                return tavoloService.rendiOccupato(id);
            case PRENOTATO:
                return tavoloService.rendiPrenotato(id);
            case NON_DISPONIBILE:
                return tavoloService.rendiNonDisponibile(id);
            default:
                return null;
        }
    }

    public static class CambioStatoRequest {
        private StatoTavolo stato;

        public StatoTavolo getStato() { return stato; }
        public void setStato(StatoTavolo stato) { this.stato = stato; }
    }
}