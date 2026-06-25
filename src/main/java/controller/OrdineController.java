package controller;

import java.util.List;
import model.Ordine;
import model.RigaOrdine;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import service.OrdineService;
import service.OrdineService;

@RestController
@RequestMapping("/api/ordini")
@CrossOrigin(origins = "*")
public class OrdineController {

    private final OrdineService ordineService;

    public OrdineController(OrdineService ordineService) {
        this.ordineService = ordineService;
    }

    @GetMapping
    public List<Ordine> getOrdini(@RequestParam(value = "attivi", required = false) Boolean attivi) {
        if (Boolean.TRUE.equals(attivi)) {
            return ordineService.getOrdiniAttivi();
        }

        return ordineService.getTuttiOrdini();
    }

    @GetMapping("/{id}")
    public Ordine getOrdineById(@PathVariable("id") Long id) {
        return ordineService.getOrdineById(id);
    }

    @PostMapping
    public Ordine creaOrdine(@RequestBody CreaOrdineRequest request) {
        return ordineService.creaOrdine(request.getTavoloId());
    }

    @PostMapping("/{id}/righe")
    public RigaOrdine aggiungiRigaOrdine(
            @PathVariable("id") Long ordineId,
            @RequestBody AggiungiRigaRequest request) {

        return ordineService.aggiungiRiga(
                ordineId,
                request.getPiattoId(),
                request.getQuantita()
        );
    }

    @PutMapping("/{id}/in-cucina")
    public Ordine inviaOrdineInCucina(@PathVariable("id") Long id) {
        return ordineService.inviaInCucina(id);
    }

    @PutMapping("/{id}/pronto")
    public Ordine segnaOrdinePronto(@PathVariable("id") Long id) {
        return ordineService.segnaPronto(id);
    }

    @PutMapping("/{id}/paga")
    public Ordine pagaOrdine(@PathVariable("id") Long id) {
        return ordineService.pagaOrdine(id);
    }

    @DeleteMapping("/{id}")
    public void annullaOrdine(@PathVariable("id") Long id) {
        ordineService.annullaOrdine(id);
    }

    public static class CreaOrdineRequest {

        private Long tavoloId;

        public Long getTavoloId() {
            return tavoloId;
        }

        public void setTavoloId(Long tavoloId) {
            this.tavoloId = tavoloId;
        }
    }

    public static class AggiungiRigaRequest {

        private Long piattoId;
        private int quantita;

        public Long getPiattoId() {
            return piattoId;
        }

        public void setPiattoId(Long piattoId) {
            this.piattoId = piattoId;
        }

        public int getQuantita() {
            return quantita;
        }

        public void setQuantita(int quantita) {
            this.quantita = quantita;
        }
    }
}