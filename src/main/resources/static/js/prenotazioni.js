/* ================================================================
   LOGICA PAGINA PRENOTAZIONI — Form e lista prenotazioni oggi
   ================================================================ */

const API_PRENOTAZIONI = "/api/prenotazioni";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    document
        .getElementById("form-prenotazione")
        .addEventListener("submit", salvaPrenotazione);

    await caricaLista();
}

async function getPrenotazioniOggi() {
    const response = await fetch(API_PRENOTAZIONI);

    if (!response.ok) {
        const errore = await response.text();
        throw new Error(errore);
    }

    return await response.json();
}

async function creaPrenotazione(dati) {
    const response = await fetch(API_PRENOTAZIONI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dati)
    });

    if (!response.ok) {
        const errore = await response.text();
        throw new Error(errore);
    }

    return await response.json();
}

async function cancellaPrenotazione(id) {
    const response = await fetch(API_PRENOTAZIONI + "/" + id, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errore = await response.text();
        throw new Error(errore);
    }
}

async function caricaLista() {
    try {
        const lista = await getPrenotazioniOggi();
        renderLista(lista);
    } catch (e) {
        console.error("Errore caricamento prenotazioni:", e);
        mostraAvviso("Errore caricamento prenotazioni: " + e.message);
    }
}

function renderLista(lista) {
    const el = document.getElementById("lista-prenotazioni");

    if (!lista || lista.length === 0) {
        el.innerHTML = '<li class="empty-state">Nessuna prenotazione oggi</li>';
        return;
    }

    el.innerHTML = lista.map(function (p) {
        // p.dataOra è "2026-06-25T23:00:00"
        // .split('T')[0] prende la data (2026-06-25)
        // .split('T')[1] prende l'ora (23:00:00)

        const dataCompleta = p.dataOra ? p.dataOra.split('T')[0] : "";
        const orario = p.dataOra ? p.dataOra.split('T')[1].substring(0, 5) : "--:--";
        const tavolo = p.idTavolo ? "Tavolo " + p.idTavolo : "Da assegnare";

        return `
        <li class="reservations-list__item">
            <div>
                <span class="reservations-list__name">${p.nomeCliente}</span>
                <span class="reservations-list__meta">
                    ${orario} · ${tavolo} · ${p.numeroPersone} pers. 
                    <small>(${dataCompleta})</small>
                </span>
            </div>
            <button type="button" data-id="${p.id}">Cancella</button>
        </li>
    `;
    }).join("");

    el.querySelectorAll("button[data-id]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            cancella(Number(btn.dataset.id));
        });
    });
}

async function salvaPrenotazione(e) {
    e.preventDefault();

    const nome = document.getElementById("nome-cliente").value.trim();
    const tavoloValue = document.getElementById("tavolo-prenotazione").value;
    const oraValue = document.getElementById("ora-prenotazione").value; // es: "23:00"

    const oggi = new Date().toISOString().split("T")[0]; // "2026-06-25"
    const dataOraString = `${oggi}T${oraValue}:00`;     // "2026-06-25T23:00:00"

    const dati = {
        nomeCliente: nome,
        dataOra: dataOraString,
        numeroPersone: Number(document.getElementById("persone").value),
        idTavolo: tavoloValue === "" ? null : Number(tavoloValue)
    };

    try {
        await creaPrenotazione(dati);
        await caricaLista();
        document.getElementById("form-prenotazione").reset();
    } catch (err) {
        console.error("Errore salvataggio:", err);
        alert("Errore salvataggio: " + err.message);
    }
}

async function cancella(id) {
    if (!confirm("Cancellare questa prenotazione?")) {
        return;
    }

    try {
        await cancellaPrenotazione(id);
        await caricaLista();
    } catch (e) {
        console.error("Errore cancellazione prenotazione:", e);
        alert("Errore cancellazione: " + e.message);
    }
}

function mostraAvviso(msg) {
    const el = document.getElementById("api-notice");

    if (!el) {
        console.warn(msg);
        return;
    }

    el.textContent = msg;
    el.classList.remove("is-hidden");
}