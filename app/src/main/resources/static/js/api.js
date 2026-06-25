/* ================================================================
   MODULO API — Comunicazione con il backend Java (Spring Boot)
   File corretto per RistoManager.
   Salva in: src/main/resources/static/js/api.js
   ================================================================ */

const API_BASE = (window.location.origin && window.location.origin.startsWith('http'))
    ? window.location.origin + '/api'
    : 'http://localhost:8080/api';

async function apiRequest(metodo, percorso, corpo) {
    const opzioni = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' }
    };

    if (corpo !== undefined) {
        opzioni.body = JSON.stringify(corpo);
    }

    const risposta = await fetch(API_BASE + percorso, opzioni);
    const testo = await risposta.text();

    if (!risposta.ok) {
        console.error('Errore backend:', { metodo, percorso, status: risposta.status, risposta: testo });
        throw new Error('Errore API ' + risposta.status + ': ' + percorso + (testo ? ' - ' + testo : ''));
    }

    return testo ? JSON.parse(testo) : null;
}

function formattaEuro(importo) {
    return '€ ' + Number(importo || 0).toFixed(2).replace('.', ',');
}

function classeStatoTavolo(stato) {
    const map = {
        LIBERO: 'table--free',
        OCCUPATO: 'table--occupied',
        PRENOTATO: 'table--reserved',
        NON_DISPONIBILE: 'table--unavailable'
    };
    return map[stato] || 'table--free';
}

function testoStatoOrdine(stato) {
    const map = {
        APERTO: 'Aperto',
        IN_CUCINA: 'In cucina',
        PRONTO: 'Pronto',
        DA_PAGARE: 'Da pagare',
        PAGATO: 'Pagato',
        ANNULLATO: 'Annullato'
    };
    return map[stato] || stato || 'Aperto';
}

function classeBadgeOrdine(stato) {
    const map = {
        APERTO: 'status-badge--open',
        IN_CUCINA: 'status-badge--kitchen',
        PRONTO: 'status-badge--ready',
        DA_PAGARE: 'status-badge--pay',
        PAGATO: 'status-badge--paid',
        ANNULLATO: 'status-badge--paid'
    };
    return map[stato] || 'status-badge--open';
}

function classeCerchioOrdine(stato) {
    const map = {
        APERTO: 'ordine-card__tavolo--open',
        IN_CUCINA: 'ordine-card__tavolo--kitchen',
        PRONTO: 'ordine-card__tavolo--ready',
        DA_PAGARE: 'ordine-card__tavolo--pay'
    };
    return map[stato] || '';
}

function formattaOraBackend(ora) {
    if (!ora) return '—';
    return String(ora).slice(0, 5);
}

function minutiDaOra(ora) {
    if (!ora) return '—';
    const pezzi = String(ora).split(':').map(Number);
    if (pezzi.length < 2 || Number.isNaN(pezzi[0]) || Number.isNaN(pezzi[1])) return '—';
    const now = new Date();
    const start = new Date();
    start.setHours(pezzi[0], pezzi[1], pezzi[2] || 0, 0);
    const diff = Math.max(0, Math.round((now - start) / 60000));
    return diff;
}

function normalizzaOrdine(o) {
    if (!o) return o;
    const righe = (o.righe || []).map(function (r) {
        const prezzo = r.prezzoUnitario != null ? r.prezzoUnitario : (r.prezzo != null ? r.prezzo : 0);
        return Object.assign({}, r, {
            prezzoUnitario: prezzo,
            prezzo: prezzo,
            totale: r.totale != null ? r.totale : prezzo * (r.quantita || 0)
        });
    });
    const totale = o.totale != null ? o.totale : righe.reduce(function (s, r) { return s + (r.prezzoUnitario || 0) * (r.quantita || 0); }, 0);
    return Object.assign({}, o, {
        righe: righe,
        totale: totale,
        subtotale: o.subtotale != null ? o.subtotale : totale,
        coperti: o.coperti != null ? o.coperti : null,
        cameriere: o.cameriere || 'Sala',
        note: o.note || 'Nessuna nota',
        apertoAlle: o.apertoAlle || formattaOraBackend(o.oraApertura),
        minutiTrascorsi: o.minutiTrascorsi != null ? o.minutiTrascorsi : minutiDaOra(o.oraApertura),
        copertoUnitario: o.copertoUnitario || 0
    });
}

async function getDashboard() {
    return apiRequest('GET', '/dashboard');
}

async function getTavoli() {
    return apiRequest('GET', '/tavoli');
}

async function getTavoloById(id) {
    return apiRequest('GET', '/tavoli/' + id);
}

async function cambiaStatoTavolo(id, stato) {
    return apiRequest('PUT', '/tavoli/' + id + '/stato', { stato });
}

async function getOrdiniAttivi() {
    const lista = await apiRequest('GET', '/ordini?attivi=true');
    return (lista || []).map(normalizzaOrdine);
}

async function getOrdiniChiusi() {
    const lista = await apiRequest('GET', '/ordini');
    return (lista || [])
        .filter(function (o) { return o.stato === 'PAGATO'; })
        .map(normalizzaOrdineChiuso)
        .sort(function (a, b) {
            return new Date(b.chiusoIl || 0) - new Date(a.chiusoIl || 0);
        });
}

function normalizzaOrdineChiuso(o) {
    const base = normalizzaOrdine(o);
    const chiuso = o.chiusoIl || o.dataChiusura || o.pagatoIl || null;
    const oraChiusura = o.oraChiusura || o.chiusoAlle || base.apertoAlle || '—';
    let chiusoIl = chiuso;
    if (!chiusoIl && o.oraApertura) {
        const oggi = new Date();
        chiusoIl = oggi.getFullYear() + '-' + String(oggi.getMonth() + 1).padStart(2, '0') + '-' + String(oggi.getDate()).padStart(2, '0');
    }
    return Object.assign({}, base, {
        stato: 'PAGATO',
        chiusoIl: chiusoIl,
        oraChiusura: oraChiusura,
        cliente: o.cliente || o.nomeCliente || '',
        metodoPagamento: o.metodoPagamento || o.pagamento || 'Contanti'
    });
}

async function getOrdine(id) {
    const ordine = await apiRequest('GET', '/ordini/' + id);
    return normalizzaOrdine(ordine);
}

async function creaOrdine(tavoloId) {
    const ordine = await apiRequest('POST', '/ordini', { tavoloId });
    return normalizzaOrdine(ordine);
}

async function aggiungiRigaOrdine(ordineId, piattoId, quantita) {
    return apiRequest('POST', '/ordini/' + ordineId + '/righe', { piattoId, quantita });
}

async function inviaOrdineInCucina(ordineId) {
    return apiRequest('PUT', '/ordini/' + ordineId + '/in-cucina');
}

async function pagaOrdine(ordineId) {
    return apiRequest('PUT', '/ordini/' + ordineId + '/paga');
}

async function annullaOrdine(ordineId) {
    return apiRequest('DELETE', '/ordini/' + ordineId);
}

async function segnaOrdinePronto(ordineId) {
    return apiRequest('PUT', '/ordini/' + ordineId + '/pronto');
}

async function getRiepilogoOrdini() {
    // Non serve un endpoint Java separato: lo calcoliamo usando gli ordini attivi + dashboard.
    const ordini = await getOrdiniAttivi();
    let dashboard = null;
    try { dashboard = await getDashboard(); } catch (e) { dashboard = null; }

    const aperti = ordini.filter(o => o.stato === 'APERTO').length;
    const inCucina = ordini.filter(o => o.stato === 'IN_CUCINA').length;
    const pronti = ordini.filter(o => o.stato === 'PRONTO').length;
    const totaleDaPagare = ordini
        .filter(o => o.stato === 'PRONTO' || o.stato === 'DA_PAGARE')
        .reduce((s, o) => s + Number(o.totale || 0), 0);

    return {
        aperti,
        inCucina,
        daPagare: pronti,
        totaleDaPagare,
        tempoMedioCucina: inCucina ? 12 : 0,
        incassoOggi: dashboard ? dashboard.incassoOggi : 0,
        variazioneIncasso: 'Aggiornato ora'
    };
}

async function getPiatti() {
    return apiRequest('GET', '/piatti');
}

async function creaPiatto(piatto) {
    return apiRequest('POST', '/piatti', {
        nome: piatto.nome,
        prezzo: Number(piatto.prezzo),
        disponibile: piatto.disponibile !== false
    });
}

async function modificaPiatto(id, piatto) {
    return apiRequest('PUT', '/piatti/' + id, {
        nome: piatto.nome,
        prezzo: Number(piatto.prezzo),
        disponibile: piatto.disponibile !== false
    });
}

async function eliminaPiatto(id) {
    return apiRequest('DELETE', '/piatti/' + id);
}

async function disattivaPiatto(id, piatto) {
    return apiRequest('PUT', '/piatti/' + id, {
        nome: piatto.nome,
        prezzo: Number(piatto.prezzo),
        disponibile: false
    });
}

async function getPrenotazioniOggi() {
    return apiRequest('GET', '/prenotazioni');
}

async function creaPrenotazione(dati) {
    return apiRequest('POST', '/prenotazioni', dati);
}

async function cancellaPrenotazione(id) {
    return apiRequest('DELETE', '/prenotazioni/' + id);
}

async function getRiepilogoChiusuraGiornata() {
    return apiRequest('GET', '/giornata/riepilogo');
}

async function chiudiGiornata(payload) {
    return apiRequest('POST', '/giornata/chiudi', payload || {});
}
