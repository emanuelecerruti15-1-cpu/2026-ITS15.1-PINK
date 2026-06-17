/* ================================================================
   LOGICA PAGINA MENU — CRUD piatti (nome + prezzo)
   ================================================================ */

const PIATTI_DEMO = [
    { id: 1, nome: 'Pizza Margherita', prezzo: 8, disponibile: true },
    { id: 2, nome: 'Spaghetti Carbonara', prezzo: 12, disponibile: true },
    { id: 3, nome: 'Insalata mista', prezzo: 9.25, disponibile: true },
    { id: 4, nome: 'Tiramisù', prezzo: 6, disponibile: true },
    { id: 5, nome: 'Cotoletta alla Milanese', prezzo: 14, disponibile: true }
];

let piatti = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        piatti = await getPiatti();
    } catch (e) {
        piatti = PIATTI_DEMO;
        mostraAvviso('Modalità demo: collega il backend per dati reali.');
    }
    renderTabella();
    document.getElementById('form-piatto').addEventListener('submit', salvaPiatto);
    document.getElementById('btn-annulla').addEventListener('click', resetForm);
}

function renderTabella() {
    const tbody = document.getElementById('tabella-piatti');
    tbody.innerHTML = piatti.map(function (p) {
        const stato = p.disponibile !== false ? 'Disponibile' : 'Non disp.';
        return '<tr><td>' + p.nome + '</td><td>' + formattaEuro(p.prezzo) + '</td><td>' + stato + '</td>' +
            '<td class="data-table__actions">' +
            '<button type="button" class="link-btn" data-edit="' + p.id + '">Modifica</button>' +
            '<button type="button" class="link-btn link-btn--muted" data-del="' + p.id + '">Elimina</button></td></tr>';
    }).join('');
    tbody.querySelectorAll('[data-edit]').forEach(function (b) {
        b.addEventListener('click', function () { modifica(Number(b.dataset.edit)); });
    });
    tbody.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () { elimina(Number(b.dataset.del)); });
    });
}

function modifica(id) {
    const p = piatti.find(function (x) { return x.id === id; });
    if (!p) return;
    document.getElementById('form-titolo').textContent = 'Modifica piatto';
    document.getElementById('piatto-id').value = p.id;
    document.getElementById('piatto-nome').value = p.nome;
    document.getElementById('piatto-prezzo').value = p.prezzo;
    document.getElementById('piatto-disponibile').value = String(p.disponibile !== false);
    document.getElementById('btn-annulla').classList.remove('is-hidden');
    document.getElementById('gruppo-disponibile').classList.remove('is-hidden');
}

function resetForm() {
    document.getElementById('form-titolo').textContent = 'Aggiungi piatto';
    document.getElementById('form-piatto').reset();
    document.getElementById('piatto-id').value = '';
    document.getElementById('btn-annulla').classList.add('is-hidden');
}

async function salvaPiatto(e) {
    e.preventDefault();
    const id = document.getElementById('piatto-id').value;
    const nome = document.getElementById('piatto-nome').value.trim();
    const prezzo = Number(document.getElementById('piatto-prezzo').value);
    const disp = document.getElementById('piatto-disponibile').value === 'true';
    try {
        if (id) {
            await modificaPiatto(Number(id), nome, prezzo, disp);
        } else {
            await creaPiatto(nome, prezzo);
        }
        location.reload();
    } catch (err) {
        alert('Backend non connesso.');
    }
}

async function elimina(id) {
    if (!confirm('Disattivare questo piatto dal menu?')) return;
    try {
        await eliminaPiatto(id);
        location.reload();
    } catch (e) { alert('Backend non connesso.'); }
}

function mostraAvviso(msg) {
    const el = document.getElementById('api-notice');
    el.textContent = msg;
    el.classList.remove('is-hidden');
}
