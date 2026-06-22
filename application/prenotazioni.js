/* ================================================================
   LOGICA PAGINA PRENOTAZIONI — Form e lista prenotazioni oggi
   ================================================================ */

const PRENOTAZIONI_DEMO = [
    { id: 1, nomeCliente: 'Giulia Rossi', ora: '14:30', tavoloNumero: 4, persone: 2 },
    { id: 2, nomeCliente: 'Marco Bianchi', ora: '20:00', tavoloNumero: 7, persone: 4 },
    { id: 3, nomeCliente: 'Sara Verdi', ora: '21:15', tavoloNumero: 3, persone: 2 }
];

document.addEventListener('DOMContentLoaded', init);

async function init() {
    document.getElementById('form-prenotazione').addEventListener('submit', salvaPrenotazione);
    await caricaLista();
}

async function caricaLista() {
    let lista;
    try {
        lista = await getPrenotazioniOggi();
    } catch (e) {
        lista = PRENOTAZIONI_DEMO;
        mostraAvviso('Modalità demo: collega il backend per dati reali.');
    }
    renderLista(lista);
}

function renderLista(lista) {
    const el = document.getElementById('lista-prenotazioni');
    if (!lista.length) {
        el.innerHTML = '<li class="empty-state">Nessuna prenotazione oggi</li>';
        return;
    }
    el.innerHTML = lista.map(function (p) {
        const tav = p.tavoloNumero ? 'Tavolo ' + p.tavoloNumero : 'Da assegnare';
        return '<li class="reservations-list__item">' +
            '<div style="display:flex;justify-content:space-between;align-items:start;gap:8px">' +
            '<div><span class="reservations-list__name">' + p.nomeCliente + '</span>' +
            '<span class="reservations-list__meta">' + p.ora + ' · ' + tav + ' · ' + p.persone + ' pers.</span></div>' +
            '<button type="button" class="link-btn link-btn--muted" data-id="' + p.id + '">Cancella</button></div></li>';
    }).join('');
    el.querySelectorAll('button[data-id]').forEach(function (btn) {
        btn.addEventListener('click', function () { cancella(Number(btn.dataset.id)); });
    });
}

async function salvaPrenotazione(e) {
    e.preventDefault();
    const dati = {
        nomeCliente: document.getElementById('nome-cliente').value.trim(),
        ora: document.getElementById('ora-prenotazione').value,
        persone: Number(document.getElementById('persone').value),
        tavoloId: document.getElementById('tavolo-prenotazione').value || null
    };
    if (dati.tavoloId) dati.tavoloId = Number(dati.tavoloId);
    try {
        await creaPrenotazione(dati);
        location.reload();
    } catch (err) {
        alert('Backend non connesso. Avvia Spring Boot per salvare.');
    }
}

async function cancella(id) {
    if (!confirm('Cancellare questa prenotazione?')) return;
    try {
        await cancellaPrenotazione(id);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

function mostraAvviso(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
