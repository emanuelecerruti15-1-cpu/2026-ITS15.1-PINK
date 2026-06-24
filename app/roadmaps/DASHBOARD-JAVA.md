# RistoManager — Backend Java MVP

> **Piano completo:** [`MVP-PIANO.md`](MVP-PIANO.md)

---

## Stack

| Componente | MVP |
|------------|-----|
| Java | 17+ |
| Framework | Spring Boot 3 |
| Database | H2 (file) — o MySQL se già configurato |
| ORM | Spring Data JPA |
| Sicurezza | **Nessuna** (niente Spring Security) |
| API | REST JSON |

---

## Struttura cartelle

```
src/main/java/com/ristomanager/
├── RistoManagerApplication.java
├── controller/     → TavoloController, OrdineController, PiattoController, PrenotazioneController, DashboardController
├── entity/         → Tavolo, Piatto, Ordine, RigaOrdine, Prenotazione
├── enums/          → StatoOrdine (APERTO, IN_CUCINA, PAGATO)
├── repository/     → JpaRepository per ogni entity
├── service/        → Logica business
└── dto/            → Risposte JSON per il frontend
```

---

## Entità (5 tabelle)

Vedi schema completo in `MVP-PIANO.md`.

**Nota:** niente `Utente`, niente `Sala`, niente `Notifica`, niente `Attivita`.

---

## Service principali

### TavoloService
- `getAllConStato()` — lista 12 tavoli + stato calcolato (LIBERO/OCCUPATO/PRENOTATO/NON_DISPONIBILE)
- `toggleNonDisponibile(id)`
- `calcolaStato(tavolo)` — priorità: nonDisponibile > ordine attivo > prenotazione imminente

### OrdineService
- `crea(tavoloId)` — solo se tavolo libero
- `aggiungiRiga(ordineId, piattoId, qty)`
- `inviaInCucina(ordineId)` — APERTO → IN_CUCINA
- `paga(ordineId)` — IN_CUCINA → PAGATO, set pagatoIl, ricalcola totale
- `getAttivi()` — APERTO + IN_CUCINA

### PiattoService
- CRUD base

### PrenotazioneService
- `getOggi()` — non cancellate, data = oggi
- `crea(dto)` / `cancella(id)`

### DashboardService
- `getRiepilogo()` — aggrega KPI + tavoli + top 5 ordini + top 5 prenotazioni

---

## Seed dati (all'avvio)

- 12 tavoli (numero 1–12, posizione_griglia 1–12, posti vari)
- 10 piatti demo (Pizza Margherita €8, Carbonara €12, …)

---

## Endpoint

Lista completa in `MVP-PIANO.md` (~15 endpoint).

---

## Cosa NON implementare

- Spring Security / JWT
- WebSocket
- Entità Utente, Sala, Notifica, Attivita
- Ricerca full-text
- Confronto incasso ieri
- Stati ordine oltre APERTO / IN_CUCINA / PAGATO

---

*Riferimento unico: `MVP-PIANO.md`*
