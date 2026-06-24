# RistoManager — Piano MVP (1 settimana)

**Obiettivo:** gestionale ristorante funzionante e dimostrabile in 7 giorni.  
**Regola:** meglio 4 moduli che funzionano che 15 a metà.

---

## Cosa include l'MVP

| Modulo | Cosa fa |
|--------|---------|
| **Dashboard** | KPI semplici + piantina sala + anteprima ordini e prenotazioni |
| **Sala / Tavoli** | 12 tavoli fissi, colori stato, click → dettaglio / azioni rapide |
| **Ordini** | Apri ordine, aggiungi piatti dal menu, 3 stati, paga e libera tavolo |
| **Menu** | CRUD piatti (nome + prezzo) |
| **Prenotazioni** | Solo oggi: aggiungi, lista, cancella |

**Accesso:** nessun login, nessun ruolo. Chi apre l'app gestisce tutto.  
**Sala:** una sola, 12 tavoli preconfigurati nel database.

---

## Cosa NON include (rimandato)

- Login, utenti, permessi, Personale
- Ricerca globale, notifiche, CTRL+K
- Attività recenti, piatti più venduti, trend % incasso
- Sale multiple (Terrazza, ecc.)
- Magazzino, Report, Impostazioni
- Aggiornamento tempo reale (WebSocket) — basta ricaricare la pagina
- Stati ordine complessi (Pronto, Servito, Annullato…)
- Prenotazioni avanzate (no-show, conferma arrivo, promemoria)
- Vista lista tavoli (solo mappa)
- Forme tavolo personalizzabili dall'utente

---

## Pagine del gestionale

```
Dashboard  →  riepilogo giornata + piantina + liste compatte
Tavoli     →  stessa piantina a schermo intero + pannello dettaglio
Ordini     →  tutti gli ordini attivi + dettaglio / cambio stato
Prenotazioni → lista oggi + form nuova prenotazione
Menu       → tabella piatti + aggiungi / modifica / elimina
```

Sidebar: **Dashboard · Tavoli · Ordini · Prenotazioni · Menu**

---

## Stati semplificati

### Tavolo (colore piantina)

| Stato | Colore | Quando |
|-------|--------|--------|
| Libero | Verde | Nessun ordine aperto |
| Occupato | Rosso | Ordine aperto o in cucina |
| Prenotato | Arancione | Prenotazione oggi entro 2 ore, tavolo libero |
| Non disponibile | Grigio | Flag manuale `nonDisponibile = true` |

**Priorità:** Non disponibile > Occupato > Prenotato > Libero

### Ordine (solo 3 stati)

```
APERTO  →  IN_CUCINA  →  PAGATO
   ↑           ↑            ↑
 creato    inviato in     conto chiuso,
           cucina         tavolo libero
```

- **APERTO:** ordine creato, si aggiungono piatti
- **IN_CUCINA:** inviato in cucina (un solo pulsante, niente "pronto")
- **PAGATO:** chiuso, entra nell'incasso di oggi

---

## Database — 5 tabelle

### tavolo
| Campo | Tipo | Note |
|-------|------|------|
| id | BIGINT PK | |
| numero | INT | 1–12, univoco |
| posti | INT | es. 4 |
| non_disponibile | BOOLEAN | default false |
| posizione_griglia | INT | 1–12, ordine nella griglia 4×3 |

*Niente tabella sala: i tavoli sono fissi, appartengono implicitamente all'unica sala.*

### piatto
| Campo | Tipo | Note |
|-------|------|------|
| id | BIGINT PK | |
| nome | VARCHAR | |
| prezzo | DECIMAL(10,2) | |
| disponibile | BOOLEAN | default true |

### ordine
| Campo | Tipo | Note |
|-------|------|------|
| id | BIGINT PK | |
| tavolo_id | BIGINT FK | |
| stato | ENUM | APERTO, IN_CUCINA, PAGATO |
| totale | DECIMAL(10,2) | calcolato dalle righe |
| creato_il | TIMESTAMP | |
| pagato_il | TIMESTAMP | null finché non pagato |

### riga_ordine
| Campo | Tipo | Note |
|-------|------|------|
| id | BIGINT PK | |
| ordine_id | BIGINT FK | |
| piatto_id | BIGINT FK | |
| quantita | INT | default 1 |
| prezzo_unitario | DECIMAL | copiato dal piatto al momento dell'ordine |

### prenotazione
| Campo | Tipo | Note |
|-------|------|------|
| id | BIGINT PK | |
| nome_cliente | VARCHAR | |
| ora | TIME | solo oggi |
| tavolo_id | BIGINT FK | opzionale |
| persone | INT | |
| cancellata | BOOLEAN | default false |

---

## API REST minime

### Dashboard
| Metodo | Endpoint | Risposta |
|--------|----------|----------|
| GET | `/api/dashboard` | KPI + tavoli + ordini attivi (max 5) + prenotazioni oggi (max 5) |

### Tavoli
| Metodo | Endpoint | Azione |
|--------|----------|--------|
| GET | `/api/tavoli` | Lista 12 tavoli con stato calcolato |
| GET | `/api/tavoli/{id}` | Dettaglio + ordine aperto se c'è |
| PUT | `/api/tavoli/{id}/non-disponibile` | Toggle non disponibile |

### Ordini
| Metodo | Endpoint | Azione |
|--------|----------|--------|
| GET | `/api/ordini?attivi=true` | Ordini APERTO + IN_CUCINA |
| GET | `/api/ordini/{id}` | Dettaglio con righe |
| POST | `/api/ordini` | `{ tavoloId }` → crea ordine APERTO |
| POST | `/api/ordini/{id}/righe` | `{ piattoId, quantita }` |
| PUT | `/api/ordini/{id}/in-cucina` | APERTO → IN_CUCINA |
| PUT | `/api/ordini/{id}/paga` | → PAGATO, tavolo libero |

### Menu
| Metodo | Endpoint | Azione |
|--------|----------|--------|
| GET | `/api/piatti` | Lista piatti |
| POST | `/api/piatti` | Crea piatto |
| PUT | `/api/piatti/{id}` | Modifica |
| DELETE | `/api/piatti/{id}` | Elimina (soft: disponibile=false) |

### Prenotazioni
| Metodo | Endpoint | Azione |
|--------|----------|--------|
| GET | `/api/prenotazioni?oggi=true` | Prenotazioni di oggi non cancellate |
| POST | `/api/prenotazioni` | Crea |
| DELETE | `/api/prenotazioni/{id}` | Cancella (cancellata=true) |

**Totale: ~15 endpoint.** Niente auth, niente JWT.

---

## KPI Dashboard (4 numeri)

| Card | Calcolo |
|------|---------|
| Incasso oggi | Somma ordini PAGATO con `pagato_il` = oggi |
| Tavoli occupati | Conta tavoli con ordine APERTO o IN_CUCINA / 12 |
| Ordini attivi | Conta ordini APERTO + IN_CUCINA |
| Prenotazioni oggi | Conta prenotazioni non cancellate di oggi |

*Niente confronto con ieri, niente "prossima alle…" (opzionale se avanza tempo).*

---

## Stack tecnico

| Layer | Scelta MVP |
|-------|------------|
| Backend | Java 17 + Spring Boot 3 |
| Database | H2 (file) o MySQL — H2 più veloce per partire |
| ORM | Spring Data JPA |
| Frontend | HTML + CSS + JavaScript vanilla |
| Auth | Nessuna |
| Real-time | Nessuno — `fetch` + reload pagina |

---

## Piano settimanale

| Giorno | Backend | Frontend |
|--------|---------|----------|
| **1** | Progetto Spring, entità, repository, seed 12 tavoli + 10 piatti | Dashboard già pronta (HTML/CSS) |
| **2** | API tavoli + calcolo stato | Collegare piantina a `/api/tavoli` |
| **3** | API ordini (crea, righe, stati) | Pagina Ordini + pannello dettaglio tavolo |
| **4** | API piatti CRUD | Pagina Menu |
| **5** | API prenotazioni + dashboard aggregata | Pagina Prenotazioni + KPI collegati |
| **6** | Bug fix, validazioni base, dati demo | Navigazione sidebar tra pagine |
| **7** | Test demo completa | Prova flusso: apri tavolo → ordine → cucina → paga |

---

## Flusso demo (2 minuti)

1. Apri Dashboard → vedi tavoli verdi/rossi e KPI
2. Clicca **Tavolo 3** (libero) → **Apri ordine**
3. Aggiungi 2× Pizza Margherita → **Invia in cucina** → tavolo rosso
4. **Paga conto** → tavolo verde, incasso aggiornato
5. **Prenotazioni** → aggiungi "Mario Rossi, 20:00, 4 pers."
6. **Menu** → aggiungi un piatto nuovo

---

## Checklist "MVP completato"

- [ ] 12 tavoli visibili sulla piantina con colori corretti
- [ ] Aprire ordine su tavolo libero
- [ ] Aggiungere piatti da menu a un ordine
- [ ] Inviare in cucina e pagare
- [ ] Incasso oggi si aggiorna dopo pagamento
- [ ] Creare e cancellare prenotazione di oggi
- [ ] CRUD piatti nel menu
- [ ] Navigazione tra le 5 pagine dalla sidebar

---

## Estensioni future (dopo la consegna)

Login · Ruoli · Notifiche · Ricerca · Attività recenti · Report · Magazzino · WebSocket · Sale multiple · Stati ordine avanzati

---

*RistoManager MVP v1.0 — piano ridotto per consegna in 1 settimana*
