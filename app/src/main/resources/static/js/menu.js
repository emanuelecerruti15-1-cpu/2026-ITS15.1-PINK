/* ================================================================
   LOGICA PAGINA MENU — CRUD piatti con KPI e ricerca
   ================================================================ */

const PIATTI_DEMO = [
    { id: 1, nome: 'Pizza Margherita', prezzo: 8, disponibile: true },
    { id: 2, nome: 'Spaghetti Carbonara', prezzo: 12, disponibile: true },
    { id: 3, nome: 'Insalata mista', prezzo: 9.25, disponibile: true }
];

const ICONE_PIATTI = {
    pizza: '🍕',
    spaghetti: '🍝',
    carbonara: '🍝',
    insalata: '🥗',
    tiramisu: '🍰',
    cotoletta: '🍗',
    default: '🍽️'
};

let piatti = [];
let filtroRicerca = '';

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        piatti = await getPiatti();
    } catch (e) {
        piatti = PIATTI_DEMO;
        mostraAvviso('Modalità demo: collega il backend per dati reali.');
        console.error(e);
    }

    aggiornaKpi();
    renderTabella();

    document.getElementById('form-piatto').addEventListener('submit', salvaPiatto);
    document.getElementById('btn-annulla').addEventListener('click', resetForm);
    document.getElementById('cerca-piatto').addEventListener('input', function (e) {
        filtroRicerca = e.target.value;
        renderTabella();
    });
}

function aggiornaKpi() {
    const totali = piatti.length;
    const disponibili = piatti.filter(function (p) { return p.disponibile !== false; }).length;
    const nonDisp = totali - disponibili;

    document.getElementById('kpi-totali').textContent = totali;
    document.getElementById('kpi-disponibili').textContent = disponibili;
    document.getElementById('kpi-non-disponibili').textContent = nonDisp;
    document.getElementById('pagination-info').textContent =
        'Mostra ' + Math.min(10, piattiFiltrati().length) + ' piatti per pagina';
}

function piattiFiltrati() {
    if (!filtroRicerca.trim()) return piatti;
    const q = filtroRicerca.trim().toLowerCase();
    return piatti.filter(function (p) {
        return p.nome.toLowerCase().includes(q);
    });
}

function iconaPiatto(nome) {
    const n = nome.toLowerCase();
    if (n.includes('pizza')) return ICONE_PIATTI.pizza;
    if (n.includes('carbonara') || n.includes('spaghetti') || n.includes('pasta')) return ICONE_PIATTI.carbonara;
    if (n.includes('insalata')) return ICONE_PIATTI.insalata;
    if (n.includes('tiram')) return ICONE_PIATTI.tiramisu;
    if (n.includes('cotoletta')) return ICONE_PIATTI.cotoletta;
    return ICONE_PIATTI.default;
}

function renderTabella() {
    const tbody = document.getElementById('tabella-piatti');
    const lista = piattiFiltrati();

    aggiornaKpi();

    if (!lista.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="menu-table__empty">Nessun piatto trovato.</td></tr>';
        return;
    }

    tbody.innerHTML = lista.map(function (p) {
        const disp = p.disponibile !== false;
        const badgeCls = disp ? 'menu-badge--ok' : 'menu-badge--no';
        const badgeTxt = disp ? 'Disponibile' : 'Non disponibile';

        return '<tr>' +
            '<td><div class="menu-table__nome">' +
                '<span class="menu-table__thumb" aria-hidden="true">' + iconaPiatto(p.nome) + '</span>' +
                '<span>' + escapeHtml(p.nome) + '</span>' +
            '</div></td>' +
            '<td class="menu-table__prezzo">' + formattaEuro(p.prezzo) + '</td>' +
            '<td><span class="menu-badge ' + badgeCls + '">' + badgeTxt + '</span></td>' +
            '<td><div class="menu-table__actions">' +
                '<button type="button" class="menu-action menu-action--edit" data-edit="' + p.id + '">' +
                    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10.5-10.5a2 2 0 00-2.83-2.83L5.17 17.17 4 20z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' +
                    'Modifica' +
                '</button>' +
                '<button type="button" class="menu-action menu-action--delete" data-del="' + p.id + '">' +
                    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12h10l1-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    'Elimina' +
                '</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');

    tbody.querySelectorAll('[data-edit]').forEach(function (b) {
        b.addEventListener('click', function () { modifica(b.dataset.edit); });
    });
    tbody.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () { elimina(b.dataset.del); });
    });
}

function modifica(id) {
    const p = trovaPiatto(id);
    if (!p) {
        alert('Piatto non trovato.');
        return;
    }

    document.getElementById('form-titolo').textContent = 'Modifica piatto';
    document.getElementById('btn-salva-piatto').innerHTML = '<span aria-hidden="true">✓</span> Salva modifiche';
    document.getElementById('piatto-id').value = p.id;
    document.getElementById('piatto-nome').value = p.nome;
    document.getElementById('piatto-prezzo').value = p.prezzo;
    document.getElementById('piatto-disponibile').value = String(p.disponibile !== false);
    document.getElementById('btn-annulla').classList.remove('is-hidden');
    document.querySelector('.menu-form-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetForm() {
    document.getElementById('form-titolo').textContent = 'Aggiungi nuovo piatto';
    document.getElementById('btn-salva-piatto').innerHTML = '<span aria-hidden="true">+</span> Salva piatto';
    document.getElementById('form-piatto').reset();
    document.getElementById('piatto-id').value = '';
    document.getElementById('piatto-disponibile').value = 'true';
    document.getElementById('btn-annulla').classList.add('is-hidden');
}

async function salvaPiatto(e) {
    e.preventDefault();

    const id = document.getElementById('piatto-id').value;
    const nome = document.getElementById('piatto-nome').value.trim();
    const prezzo = Number(document.getElementById('piatto-prezzo').value);
    const disp = document.getElementById('piatto-disponibile').value === 'true';

    if (!nome) {
        alert('Inserisci il nome del piatto.');
        return;
    }
    if (Number.isNaN(prezzo) || prezzo <= 0) {
        alert('Inserisci un prezzo valido.');
        return;
    }

    const piatto = { nome: nome, prezzo: prezzo, disponibile: disp };

    try {
        if (id) {
            await modificaPiatto(id, piatto);
        } else {
            await creaPiatto(piatto);
        }
        piatti = await getPiatti();
    } catch (err) {
        console.error(err);
        salvaLocale(id, piatto);
    }

    renderTabella();
    resetForm();
}

function salvaLocale(id, piatto) {
    if (id) {
        const idx = piatti.findIndex(function (p) { return String(p.id) === String(id); });
        if (idx >= 0) {
            piatti[idx] = Object.assign({}, piatti[idx], piatto);
        }
    } else {
        const nuovoId = piatti.length ? Math.max.apply(null, piatti.map(function (p) { return p.id; })) + 1 : 1;
        piatti.push(Object.assign({ id: nuovoId }, piatto));
    }
}

async function elimina(id) {
    const p = trovaPiatto(id);
    if (!p) {
        alert('Piatto non trovato.');
        return;
    }
    if (!confirm('Eliminare "' + p.nome + '" dal menu?')) return;

    try {
        await eliminaPiatto(id);
        piatti = await getPiatti();
    } catch (e) {
        console.error(e);
        piatti = piatti.filter(function (x) { return String(x.id) !== String(id); });
    }

    renderTabella();
    resetForm();
}

function trovaPiatto(id) {
    return piatti.find(function (x) { return String(x.id) === String(id); });
}

function mostraAvviso(msg) {
    const el = document.getElementById('api-notice');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('is-hidden');
}

function escapeHtml(testo) {
    return String(testo)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
