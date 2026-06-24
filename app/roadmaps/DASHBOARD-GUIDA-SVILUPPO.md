# RistoManager — Guida sviluppo MVP

> **Piano completo:** [`MVP-PIANO.md`](MVP-PIANO.md) · **Logica:** [`DASHBOARD-LOGICA.md`](DASHBOARD-LOGICA.md) · **Java:** [`DASHBOARD-JAVA.md`](DASHBOARD-JAVA.md)

---

## Architettura

```
HTML + CSS + JS  ──fetch JSON──►  Spring Boot  ──JPA──►  H2/MySQL
```

---

## Pagine da creare

| File | Contenuto |
|------|-----------|
| `dashboard/index.html` | ✅ Già pronta (MVP semplificata) |
| `dashboard/tavoli.html` | Piantina full + pannello dettaglio |
| `dashboard/ordini.html` | Lista ordini attivi + dettaglio |
| `dashboard/prenotazioni.html` | Lista + form nuova prenotazione |
| `dashboard/menu.html` | Tabella piatti + form |
| `dashboard/css/style.css` | ✅ Stili condivisi |
| `dashboard/js/api.js` | Helper fetch verso `/api/...` |

---

## Elementi Dashboard (solo quelli MVP)

| Elemento | Frontend | Backend |
|----------|----------|---------|
| Sidebar 5 voci | Link HTML tra pagine | — |
| Saluto | Testo fisso | — |
| 4 KPI | Popolati da `/api/dashboard` | DashboardService |
| Piantina 12 tavoli | Colori da `stato` in JSON | TavoloService |
| Legenda 4 colori | Statica | — |
| Ordini attivi (max 5) | Lista da dashboard JSON | OrdineService |
| Prenotazioni (max 5) | Lista da dashboard JSON | PrenotazioneService |

**Rimossi dall'MVP:** ricerca, notifiche, profilo utente, attività recenti, piatti top, trend %, toggle lista/mappa, Esci.

---

## JavaScript minimo

```javascript
// dashboard/js/api.js — esempio
const API = 'http://localhost:8080/api';

async function getDashboard() {
  const res = await fetch(`${API}/dashboard`);
  return res.json();
}
```

Ogni pagina al load chiama la sua API e aggiorna il DOM. Niente framework JS.

---

## Ordine di sviluppo consigliato

1. Backend seed + GET `/api/tavoli`
2. Collegare colori piantina
3. POST ordine + righe + stati
4. Pagina Menu + CRUD piatti
5. Prenotazioni + dashboard aggregata
6. Altre pagine HTML + navigazione sidebar

---

## Checklist frontend

- [ ] `api.js` con funzioni fetch
- [ ] Dashboard legge dati reali
- [ ] Click tavolo apre pannello azioni
- [ ] 4 pagine secondarie collegate dalla sidebar
- [ ] Ricarica pagina dopo ogni azione importante

---

*Riferimento unico: `MVP-PIANO.md`*
