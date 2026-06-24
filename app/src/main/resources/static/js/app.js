/* ================================================================
   APP COMUNE — Orologio sidebar + chiusura giornata
   Chiudi giornata = archivia sessione corrente + avvia nuova sessione
   ================================================================ */

const ARCHIVIO_ORDINI_KEY = 'ristomanager:archivioOrdini';
const ORDINI_CHIUSI_CACHE_KEY = 'ristomanager:ordiniChiusiOggiCache';
const ORDINI_NASCOSTI_KEY = 'ristomanager:ordiniNascostiIds';
const SESSIONE_INIZIO_KEY = 'ristomanager:sessioneInizio';
const TOAST_NUOVA_SESSIONE_KEY = 'ristomanager:toastNuovaSessione';

document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('ristomanager:giornataChiusa');

    inizializzaSidebarNav();
    aggiornaOrologioSidebar();
    setInterval(aggiornaOrologioSidebar, 60000);
    inizializzaChiudiGiornata();
    mostraToastNuovaSessione();
});

const SIDEBAR_VOCI = [
    {
        href: 'index.html',
        file: 'index.html',
        label: 'Dashboard',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" fill="currentColor"/></svg>'
    },
    {
        href: 'tavoli.html',
        file: 'tavoli.html',
        label: 'Tavoli',
        icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="3" rx="1" fill="currentColor"/><path d="M5 8v10M19 8v10M3 18h18" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
        href: 'ordini.html',
        file: 'ordini.html',
        label: 'Ordini',
        icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
    },
    {
        href: 'prenotazioni.html',
        file: 'prenotazioni.html',
        label: 'Prenotazioni',
        icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
        href: 'menu.html',
        file: 'menu.html',
        label: 'Menu',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    }
];

function paginaSidebarCorrente() {
    const nome = location.pathname.split('/').pop().toLowerCase();
    if (!nome || nome === '') return 'index.html';
    return nome;
}

function inizializzaSidebarNav() {
    const list = document.getElementById('sidebar-menu') || document.querySelector('.sidebar__menu');
    if (!list) return;

    const pagina = paginaSidebarCorrente();

    list.innerHTML = SIDEBAR_VOCI.map(function (voce) {
        const attiva = pagina === voce.file;
        return '<li class="sidebar__menu-item' + (attiva ? ' sidebar__menu-item--active' : '') + '">' +
            '<a href="' + voce.href + '" class="sidebar__link">' +
                '<span class="sidebar__link-icon' + (attiva ? ' sidebar__link-icon--active' : '') + '" aria-hidden="true">' + voce.icon + '</span>' +
                '<span class="sidebar__link-text">' + voce.label + '</span>' +
            '</a>' +
        '</li>';
    }).join('');
}

function aggiornaOrologioSidebar() {
    const elTime = document.getElementById('sidebar-time');
    const elDate = document.getElementById('sidebar-date');
    if (!elTime || !elDate) return;

    const now = new Date();
    const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    elTime.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    elDate.textContent = now.getDate() + ' ' + mesi[now.getMonth()] + ' ' + now.getFullYear();
}

function dataOggiIso() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function formattaDataItaliana(iso) {
    if (!iso) return '';
    const p = iso.split('-');
    if (p.length !== 3) return iso;
    return p[2] + '/' + p[1] + '/' + p[0];
}

function leggiArchivioOrdini() {
    try {
        return JSON.parse(localStorage.getItem(ARCHIVIO_ORDINI_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function salvaArchivioOrdini(archivio) {
    localStorage.setItem(ARCHIVIO_ORDINI_KEY, JSON.stringify(archivio));
}

function ordiniDaArchivio() {
    return leggiArchivioOrdini().reduce(function (acc, entry) {
        return acc.concat(entry.ordini || []);
    }, []);
}

function ordiniNascostiIds() {
    try {
        return JSON.parse(localStorage.getItem(ORDINI_NASCOSTI_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function aggiungiOrdiniNascosti(ids) {
    const attuali = ordiniNascostiIds();
    const unici = {};
    attuali.concat(ids || []).forEach(function (id) { unici[id] = true; });
    localStorage.setItem(ORDINI_NASCOSTI_KEY, JSON.stringify(Object.keys(unici).map(Number)));
}

function incassoArchiviatoOggi() {
    return leggiArchivioOrdini()
        .filter(function (e) { return e.data === dataOggiIso(); })
        .reduce(function (s, e) { return s + Number((e.riepilogo && e.riepilogo.totale) || 0); }, 0);
}

function incassoSessioneCorrente(incassoBackend) {
    return Math.max(0, Number(incassoBackend || 0) - incassoArchiviatoOggi());
}

function filtraOrdiniSessioneCorrente(ordini) {
    const nascosti = ordiniNascostiIds();
    if (!nascosti.length) return ordini || [];
    return (ordini || []).filter(function (o) {
        return nascosti.indexOf(Number(o.id)) === -1;
    });
}

function inizializzaChiudiGiornata() {
    creaModaleChiudiGiornata();

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action="chiudi-giornata"]');
        if (!btn) return;
        e.preventDefault();
        apriModaleChiudiGiornata();
    });
}

function mostraToastNuovaSessione() {
    if (sessionStorage.getItem(TOAST_NUOVA_SESSIONE_KEY) !== '1') return;
    sessionStorage.removeItem(TOAST_NUOVA_SESSIONE_KEY);

    const toast = document.createElement('div');
    toast.className = 'app-toast app-toast--success';
    toast.setAttribute('role', 'status');
    toast.textContent = 'Giornata archiviata. Nuova giornata operativa avviata.';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.classList.add('is-visible');
    });

    setTimeout(function () {
        toast.classList.remove('is-visible');
        setTimeout(function () { toast.remove(); }, 300);
    }, 4500);
}

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise(function (_, reject) {
            setTimeout(function () { reject(new Error('timeout')); }, ms);
        })
    ]);
}

function creaModaleChiudiGiornata() {
    if (document.getElementById('modal-chiudi-giornata')) return;

    document.body.insertAdjacentHTML('beforeend',
        '<div class="chiudi-giornata-modal is-hidden" id="modal-chiudi-giornata" role="dialog" aria-modal="true" aria-labelledby="chiudi-giornata-title">' +
            '<div class="chiudi-giornata-modal__backdrop" data-chiudi-giornata="annulla"></div>' +
            '<div class="chiudi-giornata-modal__panel">' +
                '<h2 class="chiudi-giornata-modal__title" id="chiudi-giornata-title">Chiudi giornata</h2>' +
                '<p class="chiudi-giornata-modal__subtitle" id="chiudi-giornata-subtitle"></p>' +
                '<div class="chiudi-giornata-modal__stats" id="chiudi-giornata-stats"></div>' +
                '<div class="chiudi-giornata-modal__actions">' +
                    '<button type="button" class="chiudi-giornata-modal__btn chiudi-giornata-modal__btn--ghost" data-chiudi-giornata="annulla">Annulla</button>' +
                    '<button type="button" class="chiudi-giornata-modal__btn chiudi-giornata-modal__btn--primary" data-chiudi-giornata="conferma">Esporta e nuova giornata</button>' +
                '</div>' +
            '</div>' +
        '</div>'
    );

    const modale = document.getElementById('modal-chiudi-giornata');
    modale.addEventListener('click', function (e) {
        const azione = e.target.closest('[data-chiudi-giornata]');
        if (!azione) return;
        if (azione.dataset.chiudiGiornata === 'annulla') {
            chiudiModaleChiudiGiornata();
        } else if (azione.dataset.chiudiGiornata === 'conferma') {
            eseguiChiusuraGiornata();
        }
    });
}

function chiudiModaleChiudiGiornata() {
    const modale = document.getElementById('modal-chiudi-giornata');
    if (modale) modale.classList.add('is-hidden');
}

function calcolaRiepilogoGiornata(ordini) {
    const totale = ordini.reduce(function (s, o) { return s + Number(o.totale || 0); }, 0);
    let carta = 0;
    let contanti = 0;

    ordini.forEach(function (o) {
        const metodo = String(o.metodoPagamento || o.pagamento || '').toLowerCase();
        const importo = Number(o.totale || 0);
        if (metodo.indexOf('carta') !== -1) {
            carta += importo;
        } else {
            contanti += importo;
        }
    });

    return {
        totale: totale,
        count: ordini.length,
        carta: carta,
        contanti: contanti
    };
}

function formattaEuroApp(importo) {
    if (typeof formattaEuro === 'function') {
        return formattaEuro(importo);
    }
    return '€ ' + Number(importo || 0).toFixed(2).replace('.', ',');
}

async function raccogliOrdiniChiusiSessione() {
    const oggi = dataOggiIso();
    const nascosti = ordiniNascostiIds();
    let ordini = [];

    if (typeof getOrdiniChiusi === 'function') {
        try {
            ordini = await withTimeout(getOrdiniChiusi(), 5000);
        } catch (e) {
            ordini = [];
        }
    }

    ordini = ordini.filter(function (o) {
        if (o.chiusoIl !== oggi) return false;
        return nascosti.indexOf(Number(o.id)) === -1;
    });

    if (!ordini.length) {
        try {
            const cache = JSON.parse(sessionStorage.getItem(ORDINI_CHIUSI_CACHE_KEY) || '[]');
            ordini = cache.filter(function (o) {
                if (o.chiusoIl !== oggi) return false;
                return nascosti.indexOf(Number(o.id)) === -1;
            });
        } catch (e) {
            ordini = [];
        }
    }

    return ordini;
}

async function raccogliRiepilogoGiornata() {
    const ordini = await raccogliOrdiniChiusiSessione();
    const riepilogo = calcolaRiepilogoGiornata(ordini);

    if (!ordini.length && typeof getDashboard === 'function') {
        try {
            const dash = await withTimeout(getDashboard(), 4000);
            const incassoSessione = incassoSessioneCorrente(dash && dash.incassoOggi);
            if (incassoSessione > 0) {
                return {
                    ordini: ordini,
                    riepilogo: {
                        totale: incassoSessione,
                        count: Number(dash.ordiniPagatiOggi || 0),
                        carta: 0,
                        contanti: 0,
                        daDashboard: true
                    }
                };
            }
        } catch (e) {}
    }

    return { ordini: ordini, riepilogo: riepilogo };
}

function renderStatsModaleChiusura(stats, riepilogo) {
    let html =
        '<div class="chiudi-giornata-modal__stat"><span>Totale incassato</span><strong>' + formattaEuroApp(riepilogo.totale) + '</strong></div>' +
        '<div class="chiudi-giornata-modal__stat"><span>Ordini pagati</span><strong>' + riepilogo.count + '</strong></div>' +
        '<div class="chiudi-giornata-modal__stat"><span>Carta</span><strong>' + formattaEuroApp(riepilogo.carta) + '</strong></div>' +
        '<div class="chiudi-giornata-modal__stat"><span>Contanti</span><strong>' + formattaEuroApp(riepilogo.contanti) + '</strong></div>';

    if (riepilogo.daDashboard) {
        html += '<div class="chiudi-giornata-modal__stat"><span>Nota</span><strong>Incasso sessione corrente</strong></div>';
    }

    stats.innerHTML = html;
}

async function apriModaleChiudiGiornata() {
    const modale = document.getElementById('modal-chiudi-giornata');
    const subtitle = document.getElementById('chiudi-giornata-subtitle');
    const stats = document.getElementById('chiudi-giornata-stats');
    if (!modale || !subtitle || !stats) return;

    const oggi = dataOggiIso();
    modale.classList.remove('is-hidden');
    subtitle.textContent = 'Vuoi chiudere la giornata del ' + formattaDataItaliana(oggi) + '? Caricamento riepilogo…';
    stats.innerHTML = '<div class="chiudi-giornata-modal__stat"><span>Attendere</span><strong>…</strong></div>';

    try {
        const risultato = await raccogliRiepilogoGiornata();
        modale.dataset.ordiniOggi = JSON.stringify(risultato.ordini);
        subtitle.textContent = 'Vuoi chiudere la giornata del ' + formattaDataItaliana(oggi) + '? Gli ordini verranno archiviati nello storico, esportati in CSV e subito dopo partirà una nuova giornata operativa.';
        renderStatsModaleChiusura(stats, risultato.riepilogo);
    } catch (e) {
        console.error('Errore riepilogo chiusura giornata:', e);
        modale.dataset.ordiniOggi = '[]';
        subtitle.textContent = 'Vuoi chiudere la giornata del ' + formattaDataItaliana(oggi) + '? Verrà avviata una nuova giornata operativa.';
        renderStatsModaleChiusura(stats, { totale: 0, count: 0, carta: 0, contanti: 0 });
    }
}

function esportaRiepilogoCsv(ordini, dataIso, sessioneId) {
    const righe = ['Ora chiusura;Ordine;Tavolo;Cliente;Totale;Metodo pagamento;Stato'];

    ordini.forEach(function (o) {
        const tavolo = o.tavoloNumero != null ? 'Tavolo ' + o.tavoloNumero : (o.tavolo || '—');
        const totale = Number(o.totale || 0).toFixed(2).replace('.', ',');
        righe.push([
            o.oraChiusura || '—',
            '#' + o.id,
            tavolo,
            o.cliente || '',
            totale,
            o.metodoPagamento || o.pagamento || 'Contanti',
            'Pagato'
        ].join(';'));
    });

    const blob = new Blob(['\ufeff' + righe.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'riepilogo_ordini_' + dataIso + '_sessione-' + sessioneId + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function eseguiChiusuraGiornata() {
    const modale = document.getElementById('modal-chiudi-giornata');
    const btnConferma = modale ? modale.querySelector('[data-chiudi-giornata="conferma"]') : null;
    if (btnConferma) {
        btnConferma.disabled = true;
        btnConferma.textContent = 'Chiusura in corso…';
    }

    const oggi = dataOggiIso();
    const sessioneId = Date.now();
    let ordini = [];

    try {
        ordini = JSON.parse(modale.dataset.ordiniOggi || '[]');
    } catch (e) {
        ordini = await raccogliOrdiniChiusiSessione();
    }

    let ordiniAttivi = [];
    if (typeof getOrdiniAttivi === 'function') {
        try {
            ordiniAttivi = await withTimeout(getOrdiniAttivi(), 4000);
        } catch (e) {
            ordiniAttivi = [];
        }
    }

    const riepilogo = calcolaRiepilogoGiornata(ordini);
    const idsDaNascondere = ordini.map(function (o) { return Number(o.id); })
        .concat(ordiniAttivi.map(function (o) { return Number(o.id); }));

    if (ordini.length) {
        esportaRiepilogoCsv(ordini, oggi, sessioneId);
    }

    const archivio = leggiArchivioOrdini();
    archivio.unshift({
        id: sessioneId,
        data: oggi,
        chiusoAlle: new Date().toISOString(),
        ordini: ordini,
        riepilogo: riepilogo
    });
    salvaArchivioOrdini(archivio);
    aggiungiOrdiniNascosti(idsDaNascondere);
    localStorage.setItem(SESSIONE_INIZIO_KEY, new Date().toISOString());
    sessionStorage.removeItem(ORDINI_CHIUSI_CACHE_KEY);
    sessionStorage.setItem(TOAST_NUOVA_SESSIONE_KEY, '1');

    if (typeof chiudiGiornata === 'function') {
        try {
            await chiudiGiornata({ data: oggi, sessioneId: sessioneId, riepilogo: riepilogo });
        } catch (e) {
            console.warn('Endpoint chiusura giornata non disponibile, archivio locale salvato.', e);
        }
    }

    document.dispatchEvent(new CustomEvent('giornata-chiusa', {
        detail: { data: oggi, sessioneId: sessioneId, ordini: ordini, riepilogo: riepilogo, nuovaSessione: true }
    }));

    chiudiModaleChiudiGiornata();
    location.reload();
}

window.ordiniDaArchivio = ordiniDaArchivio;
window.dataOggiIso = dataOggiIso;
window.apriModaleChiudiGiornata = apriModaleChiudiGiornata;
window.incassoSessioneCorrente = incassoSessioneCorrente;
window.filtraOrdiniSessioneCorrente = filtraOrdiniSessioneCorrente;
window.ordiniNascostiIds = ordiniNascostiIds;
