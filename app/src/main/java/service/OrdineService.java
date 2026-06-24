package service;

import java.util.Arrays;
import java.util.List;
import model.Ordine;
import model.RigaOrdine;
import model.StatoOrdine;
import org.springframework.stereotype.Service;
import repository.OrdineRepository;
import repository.PiattoRepository; // Ti serve per cercare il prezzo dei piatti
import model.Piatto;
import repository.RigaOrdineRepository;


@Service
public class OrdineService {

    private final OrdineRepository ordineRepository;
    private final PiattoRepository piattoRepository;
    private RigaOrdineRepository rigaOrdineRepository;

    public OrdineService(OrdineRepository ordineRepository, PiattoRepository piattoRepository) {
        this.ordineRepository = ordineRepository;
        this.piattoRepository = piattoRepository;
    }

    public List<Ordine> getTuttiOrdini() {
        return ordineRepository.findAll();
    }

    public List<Ordine> getOrdiniAttivi() {
        // Un ordine è attivo se lo stato è APERTO, IN_CUCINA o PRONTO (quindi non pagato o annullato)
        return ordineRepository.findByStatoIn(Arrays.asList(StatoOrdine.APERTO, StatoOrdine.IN_CUCINA, StatoOrdine.PRONTO));
    }

    public Ordine getOrdineById(Long id) {
        return ordineRepository.findById(id).orElse(null);
    }

    public Ordine creaOrdine(Long tavoloId) {
        Ordine nuovo = new Ordine(null, tavoloId);
        return ordineRepository.save(nuovo);
    }


    public RigaOrdine aggiungiRiga(Long ordineId, Long piattoId, int quantita) {
        Ordine ordine = getOrdineById(ordineId);
        Piatto piatto = piattoRepository.findById(piattoId).orElse(null);

        if (ordine != null && piatto != null) {
            // Salva direttamente la riga collegandola all'ordine
            RigaOrdine nuovaRiga = new RigaOrdine(null, ordineId, piatto.getNome(), quantita, piatto.getPrezzo());
            return rigaOrdineRepository.save(nuovaRiga);
        }
        return null;
    }

    public Ordine inviaInCucina(Long id) {
        Ordine o = getOrdineById(id);
        if (o != null) { o.setStato(StatoOrdine.IN_CUCINA); ordineRepository.save(o); }
        return o;
    }

    public Ordine segnaPronto(Long id) {
        Ordine o = getOrdineById(id);
        if (o != null) { o.setStato(StatoOrdine.PRONTO); ordineRepository.save(o); }
        return o;
    }

    public Ordine pagaOrdine(Long id) {
        Ordine o = getOrdineById(id);
        if (o != null) { o.setStato(StatoOrdine.PAGATO); ordineRepository.save(o); }
        return o;
    }

    public void annullaOrdine(Long id) {
        Ordine o = getOrdineById(id);
        if (o != null) { o.setStato(StatoOrdine.ANNULLATO); ordineRepository.save(o); }
    }
}