/* ================================================================
   LOGICA PAGINA ORDINI — Lista e dettaglio ordini attivi
   Descrizione: Carica ordini APERTO/IN_CUCINA, gestisce righe e stati.
   ================================================================ */

const ORDINI_DEMO = [
    { id: 1, tavoloNumero: 2, stato: 'IN_CUCINA', totale: 42, righe: [{ piattoId: 1, nome: 'Pizza Margherita', quantita: 4, prezzoUnitario: 8 }] },
    { id: 2, tavoloNumero: 5, stato: 'APERTO', totale: 24, righe: [{ piattoId: 2, nome: 'Carbonara', quantita: 2, prezzoUnitario: 12 }] },
    { id: 3, tavoloNumero: 9, stato: 'IN_CUCINA', totale: 18.5, righe: [{ piattoId: 3, nome: 'Insalata mista', quantita: 2, prezzoUnitario: 9.25 }] }
];

const PIATTI_DEMO = [
    { id: 1, nome: 'Pizza Margherita', prezzo: 8 },
    { id: 2, nome: 'Spaghetti Carbonara', prezzo: 12 },
    { id: 3, nome: 'Insalata mista', prezzo: 9.25 },
    { id: 4, nome: 'Tiramisù', prezzo: 6 }
];

let ordini = [];
let piatti = [];
let ordineSel = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        ordini = await getOrdiniAttivi();
        piatti = await getPiatti();
    } catch (e) {
        ordini = ORDINI_DEMO;
        piatti = PIATTI_DEMO;
        mostraAvviso('Modalità demo: collega il backend per dati reali.');
    }
    renderLista();
    popolaSelectPiatti();
    document.getElementById('btn-aggiungi-riga').addEventListener('click', aggiungiRiga);
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) selezionaOrdine(Number(id));
}

function renderLista() {
    const el = document.getElementById('lista-ordini');
    if (!ordini.length) {
        el.innerHTML = '<p class="empty-state">Nessun ordine attivo</p>';
        return;
    }
    el.innerHTML = ordini.map(function (o) {
        return '<div class="order-row" data-id="' + o.id + '">' +
            '<div><strong>Tavolo ' + o.tavoloNumero + '</strong><br><span style="color:#718096;font-size:12px">' + o.righe.length + ' piatti · ' + formattaEuro(o.totale) + '</span></div>' +
            '<span class="status-badge ' + classeBadgeOrdine(o.stato) + '">' + testoStatoOrdine(o.stato) + '</span></div>';
    }).join('');
    el.querySelectorAll('.order-row').forEach(function (row) {
        row.addEventListener('click', function () { selezionaOrdine(Number(row.dataset.id)); });
    });
}

function selezionaOrdine(id) {
    ordineSel = ordini.find(function (o) { return o.id === id; });
    if (!ordineSel) return;
    document.querySelectorAll('.order-row').forEach(function (r) {
        r.classList.toggle('order-row--active', Number(r.dataset.id) === id);
    });
    document.getElementById('ordine-vuoto').classList.add('is-hidden');
    document.getElementById('ordine-contenuto').classList.remove('is-hidden');
    document.getElementById('ordine-titolo').textContent = 'Tavolo ' + ordineSel.tavoloNumero;
    const badge = document.getElementById('ordine-badge');
    badge.textContent = testoStatoOrdine(ordineSel.stato);
    badge.className = 'status-badge ' + classeBadgeOrdine(ordineSel.stato);
    document.getElementById('ordine-righe').innerHTML = ordineSel.righe.map(function (r) {
        return '<div class="detail-panel__riga"><span>' + r.quantita + '× ' + r.nome + '</span><span>' + formattaEuro(r.prezzoUnitario * r.quantita) + '</span></div>';
    }).join('');
    document.getElementById('ordine-totale').textContent = formattaEuro(ordineSel.totale);
    document.getElementById('form-aggiungi').classList.toggle('is-hidden', ordineSel.stato !== 'APERTO');
    const azioni = document.getElementById('ordine-azioni');
    azioni.innerHTML = '';
    if (ordineSel.stato === 'APERTO') {
        azioni.appendChild(btn('Invia in cucina', 'btn btn--primary btn--block', inviaCucina));
    }
    if (ordineSel.stato === 'IN_CUCINA') {
        azioni.appendChild(btn('Paga conto', 'btn btn--primary btn--block', paga));
    }
}

function popolaSelectPiatti() {
    const sel = document.getElementById('select-piatto');
    sel.innerHTML = piatti.map(function (p) {
        return '<option value="' + p.id + '">' + p.nome + ' — ' + formattaEuro(p.prezzo) + '</option>';
    }).join('');
}

async function aggiungiRiga() {
    if (!ordineSel) return;
    const piattoId = Number(document.getElementById('select-piatto').value);
    const qty = Number(document.getElementById('input-quantita').value) || 1;
    try {
        await aggiungiRigaOrdine(ordineSel.id, piattoId, qty);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

async function inviaCucina() {
    try { await inviaOrdineInCucina(ordineSel.id); location.reload(); } catch (e) { alert('Backend non connesso.'); }
}

async function paga() {
    try { await pagaOrdine(ordineSel.id); location.reload(); } catch (e) { alert('Backend non connesso.'); }
}

function btn(t, c, fn) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = c; b.textContent = t;
    b.addEventListener('click', fn);
    return b;
}

function mostraAvviso(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
