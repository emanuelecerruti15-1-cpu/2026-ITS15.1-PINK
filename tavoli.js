/* ================================================================
   LOGICA PAGINA TAVOLI — Piantina interattiva e pannello dettaglio
   Descrizione: Carica tavoli dall'API, gestisce click e azioni MVP.
   ================================================================ */

/* Dati demo usati se il backend non è ancora avviato */
const TAVOLI_DEMO = [
    { id: 1, numero: 1, posti: 4, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false },
    { id: 2, numero: 2, posti: 4, forma: 'CERCHIO', stato: 'OCCUPATO', nonDisponibile: false, ordine: { id: 1, stato: 'IN_CUCINA', totale: 42, righe: [{ nome: 'Pizza Margherita', quantita: 2, prezzo: 8 }, { nome: 'Acqua', quantita: 2, prezzo: 2 }] } },
    { id: 3, numero: 3, posti: 4, forma: 'QUADRATO', stato: 'LIBERO', nonDisponibile: false },
    { id: 4, numero: 4, posti: 6, forma: 'RETTANGOLARE', stato: 'PRENOTATO', nonDisponibile: false },
    { id: 5, numero: 5, posti: 4, forma: 'QUADRATO', stato: 'OCCUPATO', nonDisponibile: false, ordine: { id: 2, stato: 'APERTO', totale: 24, righe: [{ nome: 'Carbonara', quantita: 2, prezzo: 12 }] } },
    { id: 6, numero: 6, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false },
    { id: 7, numero: 7, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false },
    { id: 8, numero: 8, posti: 6, forma: 'RETTANGOLARE', stato: 'NON_DISPONIBILE', nonDisponibile: true },
    { id: 9, numero: 9, posti: 4, forma: 'RETTANGOLARE_V', stato: 'OCCUPATO', nonDisponibile: false, ordine: { id: 3, stato: 'IN_CUCINA', totale: 18.5, righe: [{ nome: 'Insalata', quantita: 2, prezzo: 9.25 }] } },
    { id: 10, numero: 10, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false },
    { id: 11, numero: 11, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false },
    { id: 12, numero: 12, posti: 4, forma: 'QUADRATO', stato: 'NON_DISPONIBILE', nonDisponibile: true }
];

let tavoli = [];
let tavoloSelezionato = null;

/* Avvia la pagina al caricamento */
document.addEventListener('DOMContentLoaded', caricaTavoli);

/* Carica i tavoli dall'API oppure usa i dati demo */
async function caricaTavoli() {
    try {
        tavoli = await getTavoli();
    } catch (e) {
        tavoli = TAVOLI_DEMO;
        mostraAvvisoApi('Modalità demo: avvia il backend su localhost:8080 per dati reali.');
    }
    renderPiantina();
}

/* Disegna la griglia 4×3 con tutti i tavoli */
function renderPiantina() {
    const griglia = document.getElementById('piantina-griglia');
    griglia.innerHTML = '';
    tavoli.forEach(function (t) {
        const cella = document.createElement('div');
        cella.className = 'floor-plan__cell';
        const forma = formaCss(t.forma);
        const stato = classeStatoTavolo(t.stato);
        cella.innerHTML = '<div class="table-spot table-spot--' + forma + '">' +
            '<button class="table table--' + forma + ' ' + stato + '" type="button" data-id="' + t.id + '">' + t.numero + '</button></div>';
        griglia.appendChild(cella);
    });
    griglia.querySelectorAll('button[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            selezionaTavolo(Number(btn.dataset.id));
        });
    });
}

/* Restituisce la classe forma CSS dal tipo backend */
function formaCss(forma) {
    if (forma === 'QUADRATO') return 'square';
    if (forma === 'RETTANGOLARE') return 'rect-h';
    if (forma === 'RETTANGOLARE_V') return 'rect-v';
    return 'circle';
}

/* Mostra il pannello dettaglio per il tavolo cliccato */
function selezionaTavolo(id) {
    tavoloSelezionato = tavoli.find(function (t) { return t.id === id; });
    if (!tavoloSelezionato) return;
    document.getElementById('dettaglio-vuoto').classList.add('is-hidden');
    document.getElementById('dettaglio-contenuto').classList.remove('is-hidden');
    document.getElementById('dettaglio-titolo').textContent = 'Tavolo ' + tavoloSelezionato.numero;
    document.getElementById('dettaglio-meta').textContent = tavoloSelezionato.posti + ' posti';
    const badge = document.getElementById('dettaglio-badge');
    badge.textContent = testoStatoTavolo(tavoloSelezionato.stato);
    badge.className = 'status-badge ' + badgeStatoTavolo(tavoloSelezionato.stato);
    const sezOrdine = document.getElementById('dettaglio-ordine');
    const righeEl = document.getElementById('dettaglio-righe');
    if (tavoloSelezionato.ordine) {
        sezOrdine.classList.remove('is-hidden');
        righeEl.innerHTML = tavoloSelezionato.ordine.righe.map(function (r) {
            return '<div class="detail-panel__riga"><span>' + r.quantita + '× ' + r.nome + '</span><span>' + formattaEuro(r.prezzo * r.quantita) + '</span></div>';
        }).join('');
        document.getElementById('dettaglio-totale').textContent = formattaEuro(tavoloSelezionato.ordine.totale);
    } else {
        sezOrdine.classList.add('is-hidden');
    }
    renderAzioni();
}

function testoStatoTavolo(stato) {
    const m = { LIBERO: 'Libero', OCCUPATO: 'Occupato', PRENOTATO: 'Prenotato', NON_DISPONIBILE: 'Non disp.' };
    return m[stato] || stato;
}

function badgeStatoTavolo(stato) {
    const m = { LIBERO: 'status-badge--open', OCCUPATO: 'status-badge--kitchen', PRENOTATO: 'status-badge--ready', NON_DISPONIBILE: 'status-badge--paid' };
    return m[stato] || '';
}

/* Crea i pulsanti azione in base allo stato del tavolo (MVP) */
function renderAzioni() {
    const box = document.getElementById('dettaglio-azioni');
    box.innerHTML = '';
    const t = tavoloSelezionato;
    if (t.stato === 'LIBERO' || t.stato === 'PRENOTATO') {
        box.appendChild(creaBtn('Apri ordine', 'btn btn--primary btn--block', apriOrdine));
        box.appendChild(creaBtn('Segna non disponibile', 'btn btn--secondary btn--block', toggleNonDisp));
    }
    if (t.stato === 'NON_DISPONIBILE') {
        box.appendChild(creaBtn('Rendi disponibile', 'btn btn--primary btn--block', toggleNonDisp));
    }
    if (t.ordine) {
        if (t.ordine.stato === 'APERTO') {
            box.appendChild(creaBtn('Invia in cucina', 'btn btn--primary btn--block', inviaInCucina));
            box.appendChild(creaBtn('Aggiungi piatti', 'btn btn--secondary btn--block', function () { window.location.href = 'ordini.html?id=' + t.ordine.id; }));
        }
        if (t.ordine.stato === 'IN_CUCINA') {
            box.appendChild(creaBtn('Paga conto', 'btn btn--primary btn--block', pagaConto));
        }
    }
}

function creaBtn(testo, cls, fn) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = testo;
    b.addEventListener('click', fn);
    return b;
}

/* Azioni collegate alle API (con reload pagina dopo successo) */
async function apriOrdine() {
    try {
        await creaOrdine(tavoloSelezionato.id);
        location.reload();
    } catch (e) { alert('Errore: avvia il backend o usa la demo.'); }
}

async function inviaInCucina() {
    try {
        await inviaOrdineInCucina(tavoloSelezionato.ordine.id);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

async function pagaConto() {
    try {
        await pagaOrdine(tavoloSelezionato.ordine.id);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

async function toggleNonDisp() {
    try {
        await toggleTavoloNonDisponibile(tavoloSelezionato.id);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

function mostraAvvisoApi(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
