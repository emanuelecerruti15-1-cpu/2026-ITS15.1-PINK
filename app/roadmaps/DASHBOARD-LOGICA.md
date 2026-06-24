# RistoManager — Logica MVP

> **Documento ufficiale per l'MVP.** Piano completo: [`MVP-PIANO.md`](MVP-PIANO.md)  
> Le versioni precedenti (18 elementi, ruoli, sale multiple) sono **archiviate** — non svilupparle.

---

## Regole generali

- Una sola sala, 12 tavoli fissi
- Nessun login: chi usa l'app fa tutto
- Nessun aggiornamento automatico: ricaricare la pagina dopo un'azione
- Oggi = giornata corrente del sistema

---

## Dashboard

### Saluto
- Testo fisso: "Buongiorno 👋" + sottotitolo
- Nessun nome utente

### 4 KPI
| Card | Regola |
|------|--------|
| Incasso oggi | Somma ordini PAGATO di oggi |
| Tavoli occupati | Tavoli con ordine APERTO o IN_CUCINA / 12 |
| Ordini attivi | Conteggio APERTO + IN_CUCINA |
| Prenotazioni oggi | Prenotazioni non cancellate di oggi |

### Piantina
- Griglia 4×3, 12 tavoli
- Colori: Libero (verde), Occupato (rosso), Prenotato (arancione), Non disponibile (grigio)
- Click tavolo → pannello con azioni (vedi Tavoli)

### Widget laterali
- **Ordini attivi:** max 5, link "Vedi tutti" → pagina Ordini
- **Prenotazioni:** max 5 di oggi, link "Vedi tutti" → pagina Prenotazioni

---

## Tavoli

**Click su tavolo libero:**
- Pulsante "Apri ordine" → crea ordine APERTO, tavolo diventa Occupato

**Click su tavolo occupato:**
- Mostra piatti ordinati e totale
- Pulsanti: "Invia in cucina" (se APERTO) · "Paga conto" (se IN_CUCINA)

**Click su tavolo non disponibile:**
- Pulsante "Rendi disponibile"

**Su qualsiasi tavolo (tranne occupato):**
- Pulsante "Segna non disponibile"

---

## Ordini

| Stato | Significato | Azioni |
|-------|-------------|--------|
| APERTO | Si aggiungono piatti | Aggiungi piatto · Invia in cucina |
| IN_CUCINA | In preparazione | Paga conto |
| PAGATO | Chiuso | Solo lettura nello storico (fuori MVP) |

- Un tavolo = un ordine attivo alla volta
- Al pagamento: ordine PAGATO, tavolo Libero, incasso +totale

---

## Menu

- Lista piatti: nome, prezzo, disponibile sì/no
- Aggiungi / modifica / disattiva piatto
- I piatti disattivati non compaiono quando si fa un ordine

---

## Prenotazioni

- Solo data = oggi
- Campi: nome cliente, ora, persone, tavolo (opzionale)
- Azioni: crea, cancella
- Se c'è prenotazione entro 2 ore e tavolo libero → tavolo Prenotato (arancione)

---

## Sidebar

Dashboard · Tavoli · Ordini · Prenotazioni · Menu

*Niente: Esci, Personale, Magazzino, Report, Impostazioni*

---

*Riferimento unico: `MVP-PIANO.md`*
