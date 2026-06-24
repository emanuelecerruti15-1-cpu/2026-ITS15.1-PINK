package service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import model.DashboardResponse;
import model.Ordine;
import model.Prenotazioni;
import model.RigaOrdine;
import model.StatoOrdine;
import model.Tavolo;
import org.springframework.stereotype.Service;
import repository.RigaOrdineRepository;


@Service
public class DashboardService {

    private final TavoloService tavoloService;
    private final OrdineService ordineService;
    private RigaOrdineRepository rigaOrdineRepository;
    private final PrenotazioneService prenotazioneService;

    public DashboardService(TavoloService tavoloService,
                            OrdineService ordineService,
                            PrenotazioneService prenotazioneService) {
        this.tavoloService = tavoloService;
        this.ordineService = ordineService;
        this.prenotazioneService = prenotazioneService;
    }

    public DashboardResponse getDashboard() {
        DashboardResponse response = new DashboardResponse();

        List<Tavolo> tavoli = tavoloService.getTuttiITavoli();
        List<Ordine> tuttiOrdini = ordineService.getTuttiOrdini();
        List<Ordine> ordiniAttivi = ordineService.getOrdiniAttivi();
        List<Prenotazioni> prenotazioni = prenotazioneService.getTuttiOrdini();

        int tavoliOccupati = contaTavoliOccupati(tavoli);
        int tavoliTotali = tavoli.size();
        int percentualeOccupazione = tavoliTotali == 0
                ? 0
                : (int) Math.round((tavoliOccupati * 100.0) / tavoliTotali);

        response.setTavoliOccupati(tavoliOccupati);
        response.setTavoliTotali(tavoliTotali);
        response.setPercentualeOccupazione(percentualeOccupazione);
        response.setOrdiniAttivi(ordiniAttivi.size());
        response.setOrdiniInCucina(contaOrdiniInCucina(ordiniAttivi));
        response.setIncassoOggi(calcolaIncassoOggi(tuttiOrdini));
        response.setPrenotazioniOggi(contaPrenotazioniOggi(prenotazioni));
        response.setOrdiniAttiviLista(creaListaOrdiniAttivi(ordiniAttivi));
        response.setProssimePrenotazioni(creaListaPrenotazioni(prenotazioni));

        return response;
    }

    private int contaTavoliOccupati(List<Tavolo> tavoli) {
        int count = 0;
        for (Tavolo tavolo : tavoli) {
            if (tavolo.isOccupato()) {
                count++;
            }
        }
        return count;
    }

    private int contaOrdiniInCucina(List<Ordine> ordini) {
        int count = 0;
        for (Ordine ordine : ordini) {
            if (ordine.getStato() == StatoOrdine.IN_CUCINA) {
                count++;
            }
        }
        return count;
    }

    private double calcolaIncassoOggi(List<Ordine> ordini) {
        double totale = 0;
        for (Ordine ordine : ordini) {
            if (ordine.getStato() == StatoOrdine.PAGATO) {
                totale += ordine.getTotale();
            }
        }
        return totale;
    }

    private int contaPrenotazioniOggi(List<Prenotazioni> prenotazioni) {
        int count = 0;
        LocalDate oggi = LocalDate.now();

        for (Prenotazioni prenotazione : prenotazioni) {
            // Estrae solo la data dal LocalDateTime per confrontarla correttamente con oggi
            if (prenotazione.getDataOra() != null && oggi.equals(prenotazione.getDataOra().toLocalDate())) {
                count++;
            }
        }
        return count;
    }

    private List<DashboardResponse.DashboardOrdine> creaListaOrdiniAttivi(List<Ordine> ordini) {
        List<DashboardResponse.DashboardOrdine> lista = new ArrayList<>();
        for (Ordine ordine : ordini) {
            // Recupera le righe per questo specifico ordine
            List<RigaOrdine> righe = rigaOrdineRepository.findByOrdineId(ordine.getId());

            String nomiPiatti = righe.stream()
                    .map(RigaOrdine::getNome)
                    .collect(Collectors.joining(", "));

            lista.add(new DashboardResponse.DashboardOrdine(
                    ordine.getId(),
                    Math.toIntExact(ordine.getTavoloId()),
                    nomiPiatti,
                    // Calcola il totale sommando le righe recuperate
                    righe.stream().mapToDouble(RigaOrdine::getTotale).sum(),
                    statoOrdineTesto(ordine.getStato())
            ));
        }
        return lista;
    }

    private int contaPiatti(Ordine ordine) {
        List<RigaOrdine> righe = rigaOrdineRepository.findByOrdineId(ordine.getId());

        int totalePiatti = 0;
        if (righe != null) {
            for (RigaOrdine riga : righe) {
                totalePiatti += riga.getQuantita();
            }
        }
        return totalePiatti;
    }

    private String statoOrdineTesto(StatoOrdine stato) {
        if (stato == StatoOrdine.APERTO) return "Aperto";
        if (stato == StatoOrdine.IN_CUCINA) return "In cucina";
        if (stato == StatoOrdine.PRONTO) return "Pronto";
        if (stato == StatoOrdine.PAGATO) return "Pagato";
        if (stato == StatoOrdine.ANNULLATO) return "Annullato";
        return "Sconosciuto";
    }

    private List<DashboardResponse.DashboardPrenotazione> creaListaPrenotazioni(List<Prenotazioni> prenotazioni) {
        LocalDateTime adesso = LocalDateTime.now();
        List<Prenotazioni> prossime = new ArrayList<>();

        for (Prenotazioni prenotazione : prenotazioni) {
            // Confronta il LocalDateTime intero invece del solo LocalDate
            if (prenotazione.getDataOra() != null && !prenotazione.getDataOra().isBefore(adesso)) {
                prossime.add(prenotazione);
            }
        }

        // Ordinamento semplificato e moderno basato sul LocalDateTime reale
        prossime.sort(new Comparator<Prenotazioni>() {
            @Override
            public int compare(Prenotazioni p1, Prenotazioni p2) {
                if (p1.getDataOra() == null) return 1;
                if (p2.getDataOra() == null) return -1;
                return p1.getDataOra().compareTo(p2.getDataOra());
            }
        });

        List<DashboardResponse.DashboardPrenotazione> lista = new ArrayList<>();
        int limite = Math.min(5, prossime.size());

        for (int i = 0; i < limite; i++) {
            Prenotazioni p = prossime.get(i);

            // Estraiamo data e ora come stringhe dal LocalDateTime per la risposta del DTO
            String dataStr = p.getDataOra() != null ? p.getDataOra().toLocalDate().toString() : "";
            String oraStr = p.getDataOra() != null ? p.getDataOra().toLocalTime().toString() : "";

            lista.add(new DashboardResponse.DashboardPrenotazione(
                    (long) p.getId(), // Cast temporaneo a Long se il DTO della Dashboard lo richiede ancora
                    p.getNomeCliente(), // Usiamo il campo reale del DB
                    oraStr,
                    dataStr,
                    numeroTavolo(p.getIdTavolo()), // Passa l'idTavolo reale (int)
                    p.getNumeroPersone() // Usiamo il campo reale del DB
            ));
        }

        return lista;
    }

    private int numeroTavolo(int tavoloId) { // Cambiato parametro in int primitivo
        if (tavoloId == 0) {
            return 0;
        }

        Tavolo tavolo = tavoloService.getTavoloById(tavoloId);
        if (tavolo == null) {
            return 0;
        }

        return tavolo.getNumero(); // Restituisce l'attributo "numero" mappato sulla colonna "tavolo"
    }
}