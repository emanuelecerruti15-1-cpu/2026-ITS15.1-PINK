/* ================================================================
   PAGINA ORDINI — Struttura UI + dati demo
   Logica collegata al backend Java.
   ================================================================ */

const ORDINI_DEMO = [
    {
        id: 1024, tavoloNumero: 5, coperti: 2, stato: 'APERTO',
        apertoAlle: '12:41', minutiTrascorsi: 18, cameriere: 'Marco B.', note: 'Nessuna nota',
        copertoUnitario: 2, subtotale: 38, totale: 42,
        righe: [
            { id: 1, nome: 'Spaghetti alle Vongole', nota: 'Senza prezzemolo', quantita: 1, prezzoUnitario: 14, emoji: '🍝' },
            { id: 2, nome: 'Tagliata di manzo', nota: 'Cottura media', quantita: 1, prezzoUnitario: 18, emoji: '🥩' },
            { id: 3, nome: 'Insalata mista', nota: '', quantita: 1, prezzoUnitario: 6, emoji: '🥗' }
        ]
    },
    {
        id: 1023, tavoloNumero: 12, coperti: 4, stato: 'IN_CUCINA',
        apertoAlle: '12:28', minutiTrascorsi: 31, cameriere: 'Laura R.', note: 'Allergie: noci',
        copertoUnitario: 2, subtotale: 56, totale: 64,
        righe: [
            { id: 4, nome: 'Risotto ai funghi', nota: '', quantita: 2, prezzoUnitario: 14, emoji: '🍚' },
            { id: 5, nome: 'Branzino al forno', nota: '', quantita: 2, prezzoUnitario: 14, emoji: '🐟' }
        ]
    },
    {
        id: 1022, tavoloNumero: 2, coperti: 2, stato: 'APERTO',
        apertoAlle: '12:35', minutiTrascorsi: 24, cameriere: 'Marco B.', note: 'Nessuna nota',
        copertoUnitario: 2, subtotale: 24, totale: 28,
        righe: [
            { id: 6, nome: 'Carbonara', nota: '', quantita: 2, prezzoUnitario: 12, emoji: '🍝' }
        ]
    },
    {
        id: 1021, tavoloNumero: 8, coperti: 6, stato: 'IN_CUCINA',
        apertoAlle: '12:15', minutiTrascorsi: 44, cameriere: 'Giulia P.', note: 'Tavolo festa',
        copertoUnitario: 2, subtotale: 78, totale: 90,
        righe: [
            { id: 7, nome: 'Pizza Margherita', nota: '', quantita: 3, prezzoUnitario: 10, emoji: '🍕' },
            { id: 8, nome: 'Lasagne', nota: '', quantita: 3, prezzoUnitario: 12, emoji: '🍝' }
        ]
    },
    {
        id: 1020, tavoloNumero: 14, coperti: 3, stato: 'DA_PAGARE',
        apertoAlle: '11:50', minutiTrascorsi: 69, cameriere: 'Laura R.', note: 'Conto separato',
        copertoUnitario: 2, subtotale: 52, totale: 58,
        righe: [
            { id: 9, nome: 'Tiramisù', nota: '', quantita: 3, prezzoUnitario: 6, emoji: '🍰' },
            { id: 10, nome: 'Acqua frizzante', nota: '', quantita: 2, prezzoUnitario: 3, emoji: '💧' }
        ]
    },
    {
        id: 1019, tavoloNumero: 7, coperti: 2, stato: 'PRONTO',
        apertoAlle: '12:20', minutiTrascorsi: 39, cameriere: 'Marco B.', note: 'Nessuna nota',
        copertoUnitario: 2, subtotale: 32, totale: 36,
        righe: [
            { id: 11, nome: 'Penne all\'arrabbiata', nota: 'Poco piccante', quantita: 2, prezzoUnitario: 11, emoji: '🍝' },
            { id: 12, nome: 'Patate al forno', nota: '', quantita: 1, prezzoUnitario: 10, emoji: '🥔' }
        ]
    }
];

const PIATTI_DEMO = [
    { id: 1, nome: 'Spaghetti alle Vongole', prezzo: 14 },
    { id: 2, nome: 'Tagliata di manzo', prezzo: 18 },
    { id: 3, nome: 'Insalata mista', prezzo: 6 },
    { id: 4, nome: 'Carbonara', prezzo: 12 },
    { id: 5, nome: 'Tiramisù', prezzo: 6 }
];

const KPI_DEMO = {
    aperti: 12,
    inCucina: 5,
    tempoMedioCucina: 18,
    daPagare: 3,
    totaleDaPagare: 186,
    incassoOggi: 1245.5,
    variazioneIncasso: '+12% vs ieri'
};

function dataIsoOffset(giorni) {
    const d = new Date();
    d.setDate(d.getDate() + giorni);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

const ORDINI_CHIUSI_DEMO = [
    {
        id: 1025, tavoloNumero: 3, coperti: 2, cliente: '', cameriere: 'Marco B.', note: 'Nessuna nota',
        apertoAlle: '13:55', chiusoIl: dataIsoOffset(0), oraChiusura: '14:42',
        metodoPagamento: 'Carta **** 4242', copertoUnitario: 2, subtotale: 28.5, totale: 32.5, stato: 'PAGATO',
        righe: [
            { nome: 'Penne all\'arrabbiata', nota: '', quantita: 1, prezzoUnitario: 11, emoji: '🍝' },
            { nome: 'Acqua naturale', nota: '', quantita: 2, prezzoUnitario: 2.5, emoji: '💧' },
            { nome: 'Tiramisù', nota: '', quantita: 1, prezzoUnitario: 6, emoji: '🍰' }
        ]
    },
    {
        id: 1024, tavoloNumero: 5, coperti: 2, cliente: 'Marco Bianchi', cameriere: 'Laura R.', note: 'Nessuna nota',
        apertoAlle: '12:41', chiusoIl: dataIsoOffset(0), oraChiusura: '14:18',
        metodoPagamento: 'Contanti', copertoUnitario: 2, subtotale: 38, totale: 42, stato: 'PAGATO',
        righe: [
            { nome: 'Spaghetti alle Vongole', nota: 'Senza prezzemolo', quantita: 1, prezzoUnitario: 14, emoji: '🍝' },
            { nome: 'Tagliata di manzo', nota: 'Cottura media', quantita: 1, prezzoUnitario: 18, emoji: '🥩' },
            { nome: 'Insalata mista', nota: '', quantita: 1, prezzoUnitario: 6, emoji: '🥗' }
        ]
    },
    {
        id: 1023, tavoloNumero: 12, coperti: 4, cliente: '', cameriere: 'Giulia P.', note: 'Tavolo festa',
        apertoAlle: '12:28', chiusoIl: dataIsoOffset(0), oraChiusura: '13:55',
        metodoPagamento: 'Carta **** 8910', copertoUnitario: 2, subtotale: 56, totale: 64, stato: 'PAGATO',
        righe: [
            { nome: 'Risotto ai funghi', nota: '', quantita: 2, prezzoUnitario: 14, emoji: '🍚' },
            { nome: 'Branzino al forno', nota: '', quantita: 2, prezzoUnitario: 14, emoji: '🐟' }
        ]
    },
    {
        id: 1022, tavoloNumero: 2, coperti: 2, cliente: 'Laura Rossi', cameriere: 'Marco B.', note: 'Nessuna nota',
        apertoAlle: '12:35', chiusoIl: dataIsoOffset(0), oraChiusura: '13:30',
        metodoPagamento: 'Contanti', copertoUnitario: 2, subtotale: 24, totale: 28, stato: 'PAGATO',
        righe: [{ nome: 'Carbonara', nota: '', quantita: 2, prezzoUnitario: 12, emoji: '🍝' }]
    },
    {
        id: 1021, tavoloNumero: 8, coperti: 6, cliente: '', cameriere: 'Giulia P.', note: 'Compleanno',
        apertoAlle: '19:30', chiusoIl: dataIsoOffset(-1), oraChiusura: '21:10',
        metodoPagamento: 'Carta **** 4242', copertoUnitario: 2, subtotale: 78, totale: 90, stato: 'PAGATO',
        righe: [
            { nome: 'Pizza Margherita', nota: '', quantita: 3, prezzoUnitario: 10, emoji: '🍕' },
            { nome: 'Lasagne', nota: '', quantita: 3, prezzoUnitario: 12, emoji: '🍝' }
        ]
    },
    {
        id: 1020, tavoloNumero: 14, coperti: 3, cliente: 'Sara Verdi', cameriere: 'Laura R.', note: 'Conto separato',
        apertoAlle: '19:00', chiusoIl: dataIsoOffset(-1), oraChiusura: '20:45',
        metodoPagamento: 'Contanti', copertoUnitario: 2, subtotale: 52, totale: 58, stato: 'PAGATO',
        righe: [
            { nome: 'Tiramisù', nota: '', quantita: 3, prezzoUnitario: 6, emoji: '🍰' },
            { nome: 'Acqua frizzante', nota: '', quantita: 2, prezzoUnitario: 3, emoji: '💧' }
        ]
    },
    {
        id: 1019, tavoloNumero: 7, coperti: 2, cliente: '', cameriere: 'Marco B.', note: 'Nessuna nota',
        apertoAlle: '18:10', chiusoIl: dataIsoOffset(-3), oraChiusura: '19:22',
        metodoPagamento: 'Carta **** 5521', copertoUnitario: 2, subtotale: 32, totale: 36, stato: 'PAGATO',
        righe: [
            { nome: 'Penne all\'arrabbiata', nota: 'Poco piccante', quantita: 2, prezzoUnitario: 11, emoji: '🍝' },
            { nome: 'Patate al forno', nota: '', quantita: 1, prezzoUnitario: 10, emoji: '🥔' }
        ]
    },
    {
        id: 1018, tavoloNumero: 1, coperti: 2, cliente: 'Giuseppe Neri', cameriere: 'Laura R.', note: 'Nessuna nota',
        apertoAlle: '11:30', chiusoIl: dataIsoOffset(-5), oraChiusura: '12:15',
        metodoPagamento: 'Contanti', copertoUnitario: 2, subtotale: 20, totale: 24, stato: 'PAGATO',
        righe: [{ nome: 'Pizza Margherita', nota: '', quantita: 2, prezzoUnitario: 10, emoji: '🍕' }]
    },
    {
        id: 1017, tavoloNumero: 9, coperti: 4, cliente: '', cameriere: 'Marco B.', note: 'Nessuna nota',
        apertoAlle: '18:45', chiusoIl: dataIsoOffset(-10), oraChiusura: '20:08',
        metodoPagamento: 'Carta **** 4242', copertoUnitario: 2, subtotale: 43.5, totale: 51.5, stato: 'PAGATO',
        righe: [
            { nome: 'Tagliata di manzo', nota: '', quantita: 2, prezzoUnitario: 18, emoji: '🥩' },
            { nome: 'Insalata mista', nota: '', quantita: 1, prezzoUnitario: 7.5, emoji: '🥗' }
        ]
    }
];

let ordini = [];
let ordiniChiusi = [];
let piatti = [];
let kpi = KPI_DEMO;
let ordineSel = null;
let filtroStato = 'TUTTI';
let testoRicerca = '';
let paginaCorrente = 1;
const ORDINI_PER_PAGINA = 6;
let quantitaAggiungi = 1;
let modalitaDemo = false;
let filtroPeriodoStorico = 'OGGI';
let storicoVisibili = 5;
const STORICO_STEP = 5;
let storicoSelId = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await caricaDati();
    await caricaStorico();
    applicaFiltroSessioneCorrente();
    renderKpi();
    renderLista();
    renderStorico();
    popolaSelectPiatti();
    collegaEventi();

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
        selezionaOrdine(Number(id));
    } else if (ordini.length) {
        selezionaOrdine(ordini[0].id);
    }
}

async function caricaDati() {
    try {
        ordini = await getOrdiniAttivi();
        piatti = await getPiatti();
        try {
            kpi = await getRiepilogoOrdini();
        } catch (e) {
            kpi = KPI_DEMO;
        }
        modalitaDemo = false;
    } catch (e) {
        ordini = ORDINI_DEMO;
        piatti = PIATTI_DEMO;
        kpi = KPI_DEMO;
        modalitaDemo = true;
        mostraAvviso('Modalità demo: avvia il backend su localhost:8080 per dati reali.');
    }
}

function applicaFiltroSessioneCorrente() {
    if (typeof window.filtraOrdiniSessioneCorrente === 'function') {
        ordini = window.filtraOrdiniSessioneCorrente(ordini);
    }
    if (typeof window.incassoSessioneCorrente === 'function' && kpi) {
        kpi = Object.assign({}, kpi, {
            incassoOggi: window.incassoSessioneCorrente(kpi.incassoOggi),
            variazioneIncasso: 'Sessione corrente'
        });
    }
    if (!ordini.length) {
        ordineSel = null;
    }
}

async function caricaStorico() {
    try {
        ordiniChiusi = await getOrdiniChiusi();
        if (modalitaDemo && !ordiniChiusi.length) {
            ordiniChiusi = ORDINI_CHIUSI_DEMO.slice();
        }
    } catch (e) {
        ordiniChiusi = ORDINI_CHIUSI_DEMO.slice();
    }

    if (typeof window.ordiniDaArchivio === 'function') {
        const archivio = window.ordiniDaArchivio();
        const ids = {};
        ordiniChiusi.forEach(function (o) { ids[o.id] = true; });
        archivio.forEach(function (o) {
            if (!ids[o.id]) {
                ordiniChiusi.push(o);
                ids[o.id] = true;
            }
        });
    }

    const oggi = dataIsoOffset(0);
    const oggiLista = ordiniChiusi.filter(function (o) { return o.chiusoIl === oggi; });
    try {
        sessionStorage.setItem('ristomanager:ordiniChiusiOggiCache', JSON.stringify(oggiLista));
    } catch (e) {}

    ordiniChiusi.sort(function (a, b) {
        return confrontaChiusura(b, a);
    });
}

function confrontaChiusura(a, b) {
    const da = (a.chiusoIl || '') + 'T' + (a.oraChiusura || '00:00');
    const db = (b.chiusoIl || '') + 'T' + (b.oraChiusura || '00:00');
    return da.localeCompare(db);
}

function passaFiltroPeriodo(o) {
    if (filtroPeriodoStorico === 'TUTTI') return true;
    if (!o.chiusoIl) return filtroPeriodoStorico === 'TUTTI';

    if (filtroPeriodoStorico === 'OGGI') {
        const nascosti = typeof window.ordiniNascostiIds === 'function' ? window.ordiniNascostiIds() : [];
        if (nascosti.indexOf(Number(o.id)) !== -1) return false;
        return o.chiusoIl === dataIsoOffset(0);
    }
    if (filtroPeriodoStorico === 'IERI') {
        return o.chiusoIl === dataIsoOffset(-1);
    }
    if (filtroPeriodoStorico === 'SETTIMANA') {
        const chiuso = new Date(o.chiusoIl + 'T12:00:00');
        const oggi = new Date();
        oggi.setHours(12, 0, 0, 0);
        const limite = new Date(oggi);
        limite.setDate(limite.getDate() - 7);
        return chiuso >= limite && chiuso <= oggi;
    }
    return true;
}

function storicoFiltrati() {
    return ordiniChiusi.filter(passaFiltroPeriodo);
}

function formattaDataOraChiusura(o) {
    if (!o.chiusoIl) return o.oraChiusura || '—';
    const p = o.chiusoIl.split('-');
    if (p.length !== 3) return o.oraChiusura || '—';
    return p[2] + '/' + p[1] + '/' + p[0] + ' ' + (o.oraChiusura || '');
}

function renderStorico() {
    const filtrati = storicoFiltrati();
    const visibili = filtrati.slice(0, storicoVisibili);
    const tbody = document.getElementById('storico-ordini-body');
    const btnMore = document.getElementById('btn-mostra-altri-storico');

    if (!filtrati.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="ordini-storico__empty">Nessun ordine chiuso per il periodo selezionato</td></tr>';
        btnMore.classList.add('is-hidden');
        return;
    }

    tbody.innerHTML = visibili.map(function (o) {
        const cliente = o.cliente
            ? '<span>' + o.cliente + '</span>'
            : '<span class="ordini-storico__cliente--vuoto">—</span>';
        return '<tr data-id="' + o.id + '"' + (storicoSelId === o.id ? ' class="ordini-storico__row--active"' : '') + '>' +
            '<td class="ordini-storico__ora">' + formattaDataOraChiusura(o) + '</td>' +
            '<td class="ordini-storico__ordine-id">#' + o.id + '</td>' +
            '<td>Tavolo ' + o.tavoloNumero + '</td>' +
            '<td>' + cliente + '</td>' +
            '<td class="ordini-storico__totale">' + formattaEuro(o.totale) + '</td>' +
            '<td class="ordini-storico__pagamento">' + (o.metodoPagamento || '—') + '</td>' +
            '<td><span class="status-badge status-badge--paid">Pagato</span></td>' +
            '<td><button type="button" class="ordini-storico__view" data-id="' + o.id + '" aria-label="Visualizza ordine #' + o.id + '">' +
                '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>' +
            '</button></td>' +
        '</tr>';
    }).join('');

    tbody.querySelectorAll('.ordini-storico__view').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            onVisualizzaStorico(Number(btn.dataset.id));
        });
    });

    if (filtrati.length > storicoVisibili) {
        btnMore.classList.remove('is-hidden');
    } else {
        btnMore.classList.add('is-hidden');
    }
}

async function onVisualizzaStorico(id) {
    let ordine = ordiniChiusi.find(function (o) { return o.id === id; });
    if (!ordine) return;

    if (!ordine.righe || !ordine.righe.length) {
        try {
            const dettaglio = await getOrdine(id);
            ordine = Object.assign({}, ordine, normalizzaOrdineChiuso(dettaglio));
            const idx = ordiniChiusi.findIndex(function (o) { return o.id === id; });
            if (idx !== -1) ordiniChiusi[idx] = ordine;
        } catch (e) {
            console.warn('Dettaglio ordine non disponibile', e);
        }
    }

    storicoSelId = id;
    renderStorico();
    mostraModalStorico(ordine);
}

function mostraModalStorico(ordine) {
    const modal = document.getElementById('modal-storico');
    document.getElementById('modal-storico-titolo').textContent = 'Tavolo ' + ordine.tavoloNumero;
    document.getElementById('modal-storico-numero').textContent = 'Ordine #' + ordine.id +
        (ordine.cliente ? ' · ' + ordine.cliente : '');

    document.getElementById('modal-storico-coperti').textContent = (ordine.coperti || '—') + ' persone';
    document.getElementById('modal-storico-chiusura').textContent = formattaDataOraChiusura(ordine);
    document.getElementById('modal-storico-cameriere').textContent = ordine.cameriere || '—';
    document.getElementById('modal-storico-pagamento').textContent = ordine.metodoPagamento || '—';

    const righe = ordine.righe || [];
    const tbody = document.getElementById('modal-storico-righe');

    if (!righe.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="ordini-storico__empty">Nessun dettaglio piatti disponibile</td></tr>';
    } else {
        tbody.innerHTML = righe.map(function (r) {
            const prezzo = r.prezzoUnitario != null ? r.prezzoUnitario : r.prezzo;
            const tot = prezzo * r.quantita;
            return '<tr>' +
                '<td><div class="ordine-riga__piatto">' +
                    '<span class="ordine-riga__thumb" aria-hidden="true">' + (r.emoji || iconaPiatto(r.nome)) + '</span>' +
                    '<span><span class="ordine-riga__nome">' + r.nome + '</span>' +
                    (r.nota ? '<span class="ordine-riga__nota">' + r.nota + '</span>' : '') +
                    '</span></div></td>' +
                '<td>' + r.quantita + '</td>' +
                '<td>' + formattaEuro(prezzo) + '</td>' +
                '<td>' + formattaEuro(tot) + '</td>' +
            '</tr>';
        }).join('');
    }

    const copertoTot = (ordine.coperti || 0) * (ordine.copertoUnitario || 0);
    document.getElementById('modal-storico-subtotale').textContent = formattaEuro(ordine.subtotale != null ? ordine.subtotale : ordine.totale);
    document.getElementById('modal-storico-coperto-label').textContent = 'Coperto' +
        (ordine.coperti ? ' (' + ordine.coperti + ' × ' + formattaEuro(ordine.copertoUnitario || 0) + ')' : '');
    document.getElementById('modal-storico-coperto').textContent = formattaEuro(copertoTot);
    document.getElementById('modal-storico-totale').textContent = formattaEuro(ordine.totale);

    modal.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-storico-chiudi').focus();
}

function chiudiModalStorico() {
    document.getElementById('modal-storico').classList.add('is-hidden');
    document.body.style.overflow = '';
}

function collegaEventi() {
    document.getElementById('ordini-search').addEventListener('input', function (e) {
        testoRicerca = e.target.value.trim().toLowerCase();
        paginaCorrente = 1;
        renderLista();
    });

    document.querySelectorAll('.ordini-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.ordini-chip').forEach(function (c) {
                c.classList.remove('ordini-chip--active');
            });
            chip.classList.add('ordini-chip--active');
            filtroStato = chip.dataset.filtro;
            paginaCorrente = 1;
            renderLista();
        });
    });

    document.getElementById('qty-minus').addEventListener('click', function () {
        if (quantitaAggiungi > 1) {
            quantitaAggiungi -= 1;
            document.getElementById('qty-value').textContent = quantitaAggiungi;
        }
    });

    document.getElementById('qty-plus').addEventListener('click', function () {
        quantitaAggiungi += 1;
        document.getElementById('qty-value').textContent = quantitaAggiungi;
    });

    document.getElementById('btn-aggiungi-riga').addEventListener('click', onAggiungiPiatto);
    document.getElementById('btn-annulla').addEventListener('click', onAnnullaOrdine);
    document.getElementById('btn-in-cucina').addEventListener('click', onInviaCucina);
    document.getElementById('btn-pronto').addEventListener('click', onSegnaPronto);
    document.getElementById('btn-paga').addEventListener('click', onPagaConto);

    document.querySelectorAll('.ordini-storico__filtro[data-periodo]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.ordini-storico__filtro[data-periodo]').forEach(function (b) {
                b.classList.remove('ordini-storico__filtro--active');
            });
            btn.classList.add('ordini-storico__filtro--active');
            filtroPeriodoStorico = btn.dataset.periodo;
            storicoVisibili = STORICO_STEP;
            renderStorico();
        });
    });

    document.getElementById('btn-mostra-altri-storico').addEventListener('click', function () {
        storicoVisibili += STORICO_STEP;
        renderStorico();
    });

    document.getElementById('modal-storico-chiudi').addEventListener('click', chiudiModalStorico);
    document.getElementById('modal-storico-backdrop').addEventListener('click', chiudiModalStorico);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !document.getElementById('modal-storico').classList.contains('is-hidden')) {
            chiudiModalStorico();
        }
    });
}

function renderKpi() {
    document.getElementById('kpi-aperti').textContent = kpi.aperti != null ? kpi.aperti : '—';
    document.getElementById('kpi-aperti-sub').textContent = 'Aggiornato ora';
    document.getElementById('kpi-cucina').textContent = kpi.inCucina != null ? kpi.inCucina : '—';
    document.getElementById('kpi-cucina-sub').textContent = 'Tempo medio ' + (kpi.tempoMedioCucina || '—') + ' min';
    document.getElementById('kpi-da-pagare').textContent = kpi.daPagare != null ? kpi.daPagare : '—';
    document.getElementById('kpi-da-pagare-sub').textContent = 'Totale ' + formattaEuro(kpi.totaleDaPagare || 0);
    document.getElementById('kpi-incasso').textContent = formattaEuro(kpi.incassoOggi || 0);
    document.getElementById('kpi-incasso-sub').textContent = kpi.variazioneIncasso || '—';
}

function passaFiltro(o) {
    if (filtroStato !== 'TUTTI' && o.stato !== filtroStato) return false;
    if (!testoRicerca) return true;
    const haystack = [
        String(o.tavoloNumero),
        String(o.id),
        o.cameriere || '',
        o.note || ''
    ].join(' ').toLowerCase();
    return haystack.indexOf(testoRicerca) !== -1;
}

function ordiniFiltrati() {
    return ordini.filter(passaFiltro);
}

function renderLista() {
    const filtrati = ordiniFiltrati();
    const totale = filtrati.length;
    const inizio = (paginaCorrente - 1) * ORDINI_PER_PAGINA;
    const pagina = filtrati.slice(inizio, inizio + ORDINI_PER_PAGINA);
    const el = document.getElementById('lista-ordini');

    if (!totale) {
        el.innerHTML = '<p class="ordini-list__empty">Nessun ordine trovato</p>';
    } else {
        el.innerHTML = pagina.map(function (o) {
            const tNum = o.tavoloNumero || o.tavoloId || "?";

            const numPiatti = (o.righe && Array.isArray(o.righe))
                ? o.righe.reduce((s, r) => s + r.quantita, 0)
                : 0;

            const statoTesto = o.stato ? testoStatoOrdine(o.stato) : "Sconosciuto";

            return `
                <button type="button" class="ordine-card" data-id="${o.id}">
                    <div class="ordine-card__main">
                        <p class="ordine-card__title">Tavolo ${tNum}</p>
                        <p class="ordine-card__sub">Ordine #${o.id} · ${numPiatti} piatti</p>
                    </div>
                    <span class="status-badge">${statoTesto}</span>
                </button>`;
        }).join('');

        el.querySelectorAll('.ordine-card').forEach(function (card) {
            card.addEventListener('click', function () {
                selezionaOrdine(Number(card.dataset.id));
            });
        });
    }

    renderPaginazione(totale, inizio, pagina.length);
}

function renderPaginazione(totale, inizio, visibili) {
    const info = document.getElementById('pagination-info');
    const nav = document.getElementById('pagination-nav');
    if (!totale) {
        info.textContent = 'Nessun ordine';
        nav.innerHTML = '';
        return;
    }
    info.textContent = 'Mostra ' + (inizio + 1) + '-' + (inizio + visibili) + ' di ' + totale + ' ordini';
    const pagine = Math.ceil(totale / ORDINI_PER_PAGINA);
    nav.innerHTML = '';
    for (let i = 1; i <= pagine; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ordini-page-btn' + (i === paginaCorrente ? ' ordini-page-btn--active' : '');
        btn.textContent = String(i);
        btn.addEventListener('click', function () {
            paginaCorrente = i;
            renderLista();
        });
        nav.appendChild(btn);
    }
}

function selezionaOrdine(id) {
    ordineSel = ordini.find(function (o) { return o.id === id; });
    if (!ordineSel) return;

    renderLista();

    document.getElementById('ordine-vuoto').classList.add('is-hidden');
    document.getElementById('ordine-contenuto').classList.remove('is-hidden');

    document.getElementById('ordine-titolo').textContent = 'Tavolo ' + ordineSel.tavoloNumero;
    document.getElementById('ordine-numero').textContent = 'Ordine #' + ordineSel.id;

    const badge = document.getElementById('ordine-badge');
    badge.textContent = testoStatoOrdine(ordineSel.stato);
    badge.className = 'status-badge ' + classeBadgeOrdine(ordineSel.stato);

    document.getElementById('ordine-coperti').textContent = (ordineSel.coperti || '—') + ' persone';
    document.getElementById('ordine-orario').textContent = ordineSel.apertoAlle || '—';
    document.getElementById('ordine-cameriere').textContent = ordineSel.cameriere || '—';
    document.getElementById('ordine-note').textContent = ordineSel.note || 'Nessuna nota';

    const tbody = document.getElementById('ordine-righe');
    tbody.innerHTML = (ordineSel.righe || []).map(function (r) {
        const tot = r.prezzoUnitario * r.quantita;
        return '<tr>' +
            '<td><div class="ordine-riga__piatto">' +
                '<span class="ordine-riga__thumb" aria-hidden="true">' + (r.emoji || iconaPiatto(r.nome)) + '</span>' +
                '<span><span class="ordine-riga__nome">' + r.nome + '</span>' +
                (r.nota ? '<span class="ordine-riga__nota">' + r.nota + '</span>' : '') +
                '</span></div></td>' +
            '<td>' + r.quantita + '</td>' +
            '<td>' + formattaEuro(r.prezzoUnitario) + '</td>' +
            '<td>' + formattaEuro(tot) + '</td>' +
            '<td><button type="button" class="ordine-riga__menu" aria-label="Opzioni piatto">⋮</button></td>' +
        '</tr>';
    }).join('');

    const copertoTot = (ordineSel.coperti || 0) * (ordineSel.copertoUnitario || 0);
    document.getElementById('ordine-subtotale').textContent = formattaEuro(ordineSel.subtotale != null ? ordineSel.subtotale : ordineSel.totale);
    document.getElementById('ordine-coperto-label').textContent = 'Coperto' + (ordineSel.coperti ? ' (' + ordineSel.coperti + ' × ' + formattaEuro(ordineSel.copertoUnitario || 0) + ')' : '');
    document.getElementById('ordine-coperto').textContent = formattaEuro(copertoTot);
    document.getElementById('ordine-totale').textContent = formattaEuro(ordineSel.totale);

    aggiornaAzioni();
}

function aggiornaAzioni() {
    if (!ordineSel) return;
    const s = ordineSel.stato;
    const form = document.getElementById('form-aggiungi');
    const btnCucina = document.getElementById('btn-in-cucina');
    const btnPronto = document.getElementById('btn-pronto');
    const btnPaga = document.getElementById('btn-paga');
    const btnAnnulla = document.getElementById('btn-annulla');

    form.classList.toggle('is-hidden', s !== 'APERTO');
    btnCucina.disabled = s !== 'APERTO';
    btnPronto.disabled = s !== 'IN_CUCINA';
    btnPaga.disabled = s !== 'PRONTO' && s !== 'DA_PAGARE';
    btnAnnulla.disabled = s === 'PAGATO';
}

function popolaSelectPiatti() {
    const sel = document.getElementById('select-piatto');
    sel.innerHTML = '<option value="">Seleziona un piatto...</option>' +
        piatti.map(function (p) {
            return '<option value="' + p.id + '">' + p.nome + '</option>';
        }).join('');
}

function iconaPiatto(nome) {
    const n = (nome || '').toLowerCase();
    if (n.indexOf('pizza') !== -1) return '🍕';
    if (n.indexOf('pasta') !== -1 || n.indexOf('spaghetti') !== -1 || n.indexOf('carbonara') !== -1 || n.indexOf('penne') !== -1 || n.indexOf('lasagne') !== -1) return '🍝';
    if (n.indexOf('insalata') !== -1) return '🥗';
    if (n.indexOf('carne') !== -1 || n.indexOf('tagliata') !== -1) return '🥩';
    if (n.indexOf('pesce') !== -1 || n.indexOf('branzino') !== -1) return '🐟';
    if (n.indexOf('tiram') !== -1) return '🍰';
    return '🍽️';
}

/* --- Handler azioni: collegati al backend Java --- */

async function ricaricaOrdiniESeleziona(idPreferito) {
    await caricaDati();
    await caricaStorico();
    renderKpi();
    renderLista();
    renderStorico();
    popolaSelectPiatti();

    if (idPreferito && ordini.some(function (o) { return o.id === idPreferito; })) {
        selezionaOrdine(idPreferito);
    } else if (ordini.length) {
        selezionaOrdine(ordini[0].id);
    } else {
        ordineSel = null;
        document.getElementById('ordine-vuoto').classList.remove('is-hidden');
        document.getElementById('ordine-contenuto').classList.add('is-hidden');
    }
}

async function onAggiungiPiatto() {
    if (!ordineSel) return;
    const piattoId = Number(document.getElementById('select-piatto').value);
    if (!piattoId) {
        alert('Seleziona un piatto.');
        return;
    }

    try {
        await aggiungiRigaOrdine(ordineSel.id, piattoId, quantitaAggiungi);
        quantitaAggiungi = 1;
        document.getElementById('qty-value').textContent = '1';
        document.getElementById('select-piatto').value = '';
        await ricaricaOrdiniESeleziona(ordineSel.id);
    } catch (e) {
        console.error(e);
        alert('Errore aggiunta piatto: ' + e.message);
    }
}

async function onAnnullaOrdine() {
    if (!ordineSel) return;
    if (!confirm('Annullare questo ordine? Il tavolo tornerà libero.')) return;

    try {
        await annullaOrdine(ordineSel.id);
        await ricaricaOrdiniESeleziona(null);
    } catch (e) {
        console.error(e);
        alert('Errore annullamento ordine: ' + e.message);
    }
}

async function onInviaCucina() {
    if (!ordineSel) return;

    try {
        await inviaOrdineInCucina(ordineSel.id);
        await ricaricaOrdiniESeleziona(ordineSel.id);
    } catch (e) {
        console.error(e);
        alert('Errore invio in cucina: ' + e.message);
    }
}

async function onSegnaPronto() {
    if (!ordineSel) return;

    try {
        await segnaOrdinePronto(ordineSel.id);
        await ricaricaOrdiniESeleziona(ordineSel.id);
    } catch (e) {
        console.error(e);
        alert('Errore stato pronto: ' + e.message);
    }
}

async function onPagaConto() {
    if (!ordineSel) return;
    if (!confirm('Confermare pagamento? Il tavolo tornerà libero.')) return;

    try {
        await pagaOrdine(ordineSel.id);
        await ricaricaOrdiniESeleziona(null);
    } catch (e) {
        console.error(e);
        alert('Errore pagamento: ' + e.message);
    }
}

function mostraAvviso(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
