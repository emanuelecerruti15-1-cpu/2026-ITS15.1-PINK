/* ================================================================
   LOGICA PAGINA TAVOLI — Piantina, KPI, filtri e pannello gestione
   ================================================================ */

const TAVOLI_DEMO = [
    { id: 1, numero: 1, posti: 4, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-15' },
    { id: 2, numero: 2, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-18' },
    { id: 3, numero: 3, posti: 4, forma: 'QUADRATO', stato: 'LIBERO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-14' },
    { id: 4, numero: 4, posti: 6, forma: 'RETTANGOLARE', stato: 'PRENOTATO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-18' },
    { id: 5, numero: 5, posti: 4, forma: 'QUADRATO', stato: 'OCCUPATO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-18', ordine: { id: 2, stato: 'APERTO', totale: 24, righe: [{ nome: 'Carbonara', quantita: 2, prezzo: 12 }] } },
    { id: 6, numero: 6, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-12' },
    { id: 7, numero: 7, posti: 2, forma: 'CERCHIO', stato: 'LIBERO', nonDisponibile: false, creatoIl: '2024-01-10', modificatoIl: '2026-06-12' },
    { id: 8, numero: 8, posti: 6, forma: 'RETTANGOLARE', stato: 'NON_DISPONIBILE', nonDisponibile: true, creatoIl: '2024-01-10', modificatoIl: '2026-06-10' },
];

let tavoli = [];
let tavoloSelezionato = null;
let filtroStato = 'TUTTI';
let modalitaDemo = false;
let statoSelezionato = 'LIBERO';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('apri-ordine-btn').addEventListener('click', apriOrdine);
    document.getElementById('salva-stato-btn').addEventListener('click', salvaStato);

    document.querySelectorAll('.stato-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            impostaStatoSelezione(btn.dataset.stato);
        });
    });

    document.querySelectorAll('.tavoli-filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tavoli-filter').forEach(function (b) {
                b.classList.remove('tavoli-filter--active');
            });
            btn.classList.add('tavoli-filter--active');
            filtroStato = btn.dataset.filtro;
            renderPiantina();
        });
    });

    caricaTavoli();
});

async function caricaTavoli() {
    try {
        const dati = await getTavoli(); // Il tuo endpoint /api/tavoli
        tavoli = dati; // Usa solo i dati del DB, NON mischiare con dati finti
        modalitaDemo = false;

        // Collega gli ordini solo se la risposta è valida
        await collegaOrdiniAiTavoli();
        renderPiantina();
    } catch (e) {
        // Se c'è errore, stampa l'errore reale in console, non fingere che funzioni
        console.error("ERRORE CRITICO DI COMUNICAZIONE:", e);
        mostraAvvisoApi('Errore di connessione al server: controlla la console!');
    }
}

async function collegaOrdiniAiTavoli() {
    try {
        const ordiniAttivi = await getOrdiniAttivi();
        tavoli.forEach(function (t) {
            const ordine = ordiniAttivi.find(function (o) {
                return String(o.tavoloId) === String(t.id);
            });
            if (ordine) {
                t.ordine = ordine;
            } else {
                delete t.ordine;
            }
        });
    } catch (e) {
        console.warn('Ordini attivi non collegati ai tavoli:', e);
    }
}

function aggiornaKpi() {
    const liberi = tavoli.filter(function (t) { return t.stato === 'LIBERO'; }).length;
    const occupati = tavoli.filter(function (t) { return t.stato === 'OCCUPATO'; }).length;
    const prenotati = tavoli.filter(function (t) { return t.stato === 'PRENOTATO'; }).length;
    const nonDisp = tavoli.filter(function (t) { return t.stato === 'NON_DISPONIBILE'; }).length;

    document.getElementById('kpi-totali').textContent = tavoli.length;
    document.getElementById('kpi-liberi').textContent = liberi;
    document.getElementById('kpi-occupati').textContent = occupati;
    document.getElementById('kpi-prenotati').textContent = prenotati;
    document.getElementById('kpi-non-disp').textContent = nonDisp;
}

function passaFiltro(t) {
    if (filtroStato === 'TUTTI') return true;
    return t.stato === filtroStato;
}

function htmlSedie(forma) {
    if (forma === 'rect-v') {
        return '<span class="table-spot__chair table-spot__chair--w"></span><span class="table-spot__chair table-spot__chair--e"></span>';
    }
    return '<span class="table-spot__chair table-spot__chair--n"></span>' +
        '<span class="table-spot__chair table-spot__chair--s"></span>' +
        '<span class="table-spot__chair table-spot__chair--w"></span>' +
        '<span class="table-spot__chair table-spot__chair--e"></span>';
}

function renderPiantina() {
    const griglia = document.getElementById('piantina-griglia');
    griglia.innerHTML = '';
    aggiornaKpi();

    tavoli.forEach(function (t) {
        const cella = document.createElement('div');
        const visibile = passaFiltro(t);
        cella.className = 'floor-plan__cell' + (visibile ? '' : ' floor-plan__cell--hidden');
        const forma = formaCss(t.forma);
        const stato = classeStatoTavolo(t.stato);
        const selezionato = tavoloSelezionato && tavoloSelezionato.id === t.id ? ' table--selected' : '';

        cella.innerHTML = '<div class="table-spot table-spot--' + forma + '">' +
            htmlSedie(forma) +
            '<button class="table table--' + forma + ' ' + stato + selezionato + '" type="button" data-id="' + t.id + '">' + t.numero + '</button></div>';
        griglia.appendChild(cella);
    });

    griglia.querySelectorAll('button[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            selezionaTavolo(Number(btn.dataset.id));
        });
    });
}

function formaCss(forma) {
    if (forma === 'QUADRATO') return 'square';
    if (forma === 'RETTANGOLARE') return 'rect-h';
    if (forma === 'RETTANGOLARE_V') return 'rect-v';
    return 'circle';
}

function testoForma(forma) {
    const m = { CERCHIO: 'Cerchio', QUADRATO: 'Quadrato', RETTANGOLARE: 'Rettangolare', RETTANGOLARE_V: 'Rettangolare verticale' };
    return m[forma] || forma;
}

function formattaData(iso) {
    if (!iso) return '—';
    const p = iso.split('-');
    if (p.length !== 3) return iso;
    return p[2] + '/' + p[1] + '/' + p[0];
}

function selezionaTavolo(id) {
    tavoloSelezionato = tavoli.find(function (t) { return t.id === id; });
    if (!tavoloSelezionato) return;

    document.getElementById('dettaglio-vuoto').classList.add('is-hidden');
    document.getElementById('dettaglio-contenuto').classList.remove('is-hidden');

    document.getElementById('dettaglio-titolo').textContent = 'Tavolo ' + tavoloSelezionato.numero;
    document.getElementById('dettaglio-posti').textContent = tavoloSelezionato.posti + ' posti';
    document.getElementById('dettaglio-forma').textContent = 'Forma: ' + testoForma(tavoloSelezionato.forma);

    const badge = document.getElementById('dettaglio-badge');
    badge.textContent = testoStatoTavolo(tavoloSelezionato.stato);
    badge.className = 'tavolo-panel__badge status-badge ' + badgeStatoTavolo(tavoloSelezionato.stato);

    document.getElementById('info-id').textContent = '#' + tavoloSelezionato.id;
    document.getElementById('info-creato').textContent = formattaData(tavoloSelezionato.creatoIl) || '10/01/2024';
    document.getElementById('info-modifica').textContent = formattaData(tavoloSelezionato.modificatoIl) || '—';

    const sezOrdine = document.getElementById('dettaglio-ordine');
    const righeEl = document.getElementById('dettaglio-righe');
    if (tavoloSelezionato.ordine) {
        sezOrdine.classList.remove('is-hidden');
        righeEl.innerHTML = tavoloSelezionato.ordine.righe.map(function (r) {
            return '<div class="tavolo-panel__riga"><span>' + r.quantita + '× ' + r.nome + '</span><span>' + formattaEuro(r.prezzo * r.quantita) + '</span></div>';
        }).join('');
        document.getElementById('dettaglio-totale').textContent = formattaEuro(tavoloSelezionato.ordine.totale);
    } else {
        sezOrdine.classList.add('is-hidden');
    }

    impostaStatoSelezione(tavoloSelezionato.stato);
    aggiornaVisibilitaApriOrdine();
    renderPiantina();
}

function impostaStatoSelezione(stato) {
    statoSelezionato = stato;
    document.querySelectorAll('.stato-btn').forEach(function (btn) {
        const attivo = btn.dataset.stato === stato;
        btn.classList.toggle('stato-btn--active', attivo);
        btn.setAttribute('aria-pressed', attivo ? 'true' : 'false');
    });
}

function aggiornaVisibilitaApriOrdine() {
    const btn = document.getElementById('apri-ordine-btn');
    const ok = tavoloSelezionato && (tavoloSelezionato.stato === 'LIBERO' || tavoloSelezionato.stato === 'PRENOTATO');
    btn.style.display = ok ? 'inline-flex' : 'none';
}

async function apriOrdine() {
    if (!tavoloSelezionato) {
        alert("Seleziona prima un tavolo.");
        return;
    }

    try {
        const ordine = await creaOrdine(tavoloSelezionato.id);
        if (!ordine || !ordine.id) {
            throw new Error("Ordine creato ma id non ricevuto dal backend.");
        }
        window.location.href = "ordini.html?id=" + ordine.id;
    } catch (errore) {
        console.error("Errore apertura ordine:", errore);
        alert("Errore apertura ordine: " + errore.message);
    }
}

async function salvaStato() {
    if (!tavoloSelezionato) {
        alert('Seleziona prima un tavolo.');
        return;
    }

    const id = tavoloSelezionato.id;
    const stato = statoSelezionato;

    try {
        if (modalitaDemo) {
            aggiornaStatoLocale(id, stato);
            return;
        }

        await cambiaStatoTavolo(id, stato);

        await caricaTavoli();

        selezionaTavolo(id);

    } catch (e) {
        console.error("Errore salvataggio stato:", e);
        alert('Errore nel salvataggio dello stato.');
    }
}

function aggiornaStatoLocale(id, stato) {
    const t = tavoli.find(function (item) { return item.id === id; });
    if (!t) return;

    t.stato = stato;
    t.nonDisponibile = stato === 'NON_DISPONIBILE';
    t.modificatoIl = new Date().toISOString().slice(0, 10);

    if (stato === 'OCCUPATO' && !t.ordine) {
        t.ordine = { id: Date.now(), stato: 'APERTO', totale: 0, righe: [] };
    }
    if (stato !== 'OCCUPATO') {
        delete t.ordine;
    }

    selezionaTavolo(id);
}

function testoStatoTavolo(stato) {
    const m = { LIBERO: 'Libero', OCCUPATO: 'Occupato', PRENOTATO: 'Prenotato', NON_DISPONIBILE: 'Non disp.' };
    return m[stato] || stato;
}

function badgeStatoTavolo(stato) {
    const m = { LIBERO: 'status-badge--open', OCCUPATO: 'status-badge--kitchen', PRENOTATO: 'status-badge--ready', NON_DISPONIBILE: 'status-badge--paid' };
    return m[stato] || '';
}

function mostraAvvisoApi(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
