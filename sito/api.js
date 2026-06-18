/* ================================================================
   MODULO API — Comunicazione con il backend Java (Spring Boot)
   Descrizione: Funzioni fetch verso gli endpoint REST dell'MVP.
   Il collega backend implementa le API descritte in docs/MVP-PIANO.md
   ================================================================ */

/* URL base del server Spring Boot — modificarlo se la porta cambia */
const API_BASE = 'http://localhost:8080/api';

/* ---------------------------------------------------------------
   HELPER GENERICO — Esegue richieste HTTP e gestisce errori
   Descrizione: Wrapper su fetch usato da tutte le funzioni API.
   --------------------------------------------------------------- */
async function apiRequest(metodo, percorso, corpo) {
    const opzioni = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' }
    };
    /* Aggiunge il corpo JSON solo per POST e PUT */
    if (corpo !== undefined) {
        opzioni.body = JSON.stringify(corpo);
    }
    const risposta = await fetch(API_BASE + percorso, opzioni);
    if (!risposta.ok) {
        throw new Error('Errore API ' + risposta.status + ': ' + percorso);
    }
    /* Alcune DELETE non restituiscono JSON */
    const testo = await risposta.text();
    return testo ? JSON.parse(testo) : null;
}

/* Formatta un numero come prezzo in euro (es. 42 → "€ 42,00") */
function formattaEuro(importo) {
    return '€ ' + Number(importo).toFixed(2).replace('.', ',');
}

/* Mappa lo stato tavolo dal backend alla classe CSS del colore */
function classeStatoTavolo(stato) {
    const map = {
        LIBERO: 'table--free',
        OCCUPATO: 'table--occupied',
        PRENOTATO: 'table--reserved',
        NON_DISPONIBILE: 'table--unavailable'
    };
    return map[stato] || 'table--free';
}

/* Mappa lo stato ordine al testo badge italiano */
function testoStatoOrdine(stato) {
    const map = { APERTO: 'Aperto', IN_CUCINA: 'In cucina', PAGATO: 'Pagato' };
    return map[stato] || stato;
}

/* Classe CSS badge ordine in base allo stato */
function classeBadgeOrdine(stato) {
    const map = { APERTO: 'status-badge--open', IN_CUCINA: 'status-badge--kitchen', PAGATO: 'status-badge--paid' };
    return map[stato] || 'status-badge--open';
}

/* ================================================================
   API DASHBOARD — Riepilogo giornalata
   ================================================================ */
async function getDashboard() {
    return apiRequest('GET', '/dashboard');
}

/* ================================================================
   API TAVOLI — Piantina e gestione sala
   ================================================================ */
async function getTavoli() {
    return apiRequest('GET', '/tavoli');
}

async function getTavolo(id) {
    return apiRequest('GET', '/tavoli/' + id);
}

async function toggleTavoloNonDisponibile(id) {
    return apiRequest('PUT', '/tavoli/' + id + '/non-disponibile');
}

/* ================================================================
   API ORDINI — Ciclo Aperto → In cucina → Pagato
   ================================================================ */
async function getOrdiniAttivi() {
    return apiRequest('GET', '/ordini?attivi=true');
}

async function getOrdine(id) {
    return apiRequest('GET', '/ordini/' + id);
}

async function creaOrdine(tavoloId) {
    return apiRequest('POST', '/ordini', { tavoloId: tavoloId });
}

async function aggiungiRigaOrdine(ordineId, piattoId, quantita) {
    return apiRequest('POST', '/ordini/' + ordineId + '/righe', { piattoId: piattoId, quantita: quantita });
}

async function inviaOrdineInCucina(ordineId) {
    return apiRequest('PUT', '/ordini/' + ordineId + '/in-cucina');
}

async function pagaOrdine(ordineId) {
    return apiRequest('PUT', '/ordini/' + ordineId + '/paga');
}

/* ================================================================
   API MENU — CRUD piatti
   ================================================================ */
async function getPiatti() {
    return apiRequest('GET', '/piatti');
}

async function creaPiatto(nome, prezzo) {
    return apiRequest('POST', '/piatti', { nome: nome, prezzo: prezzo });
}

async function modificaPiatto(id, nome, prezzo, disponibile) {
    return apiRequest('PUT', '/piatti/' + id, { nome: nome, prezzo: prezzo, disponibile: disponibile });
}

async function eliminaPiatto(id) {
    return apiRequest('DELETE', '/piatti/' + id);
}

/* ================================================================
   API PRENOTAZIONI — Solo prenotazioni di oggi
   ================================================================ */
async function getPrenotazioniOggi() {
    return apiRequest('GET', '/prenotazioni?oggi=true');
}

async function creaPrenotazione(dati) {
    return apiRequest('POST', '/prenotazioni', dati);
}

async function cancellaPrenotazione(id) {
    return apiRequest('DELETE', '/prenotazioni/' + id);
}
