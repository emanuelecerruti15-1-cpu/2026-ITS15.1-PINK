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
        const tavolo = p.tavoloId ? "Tavolo " + p.tavoloId : "Da assegnare";

        return `
            <li class="reservations-list__item">
                <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
                    <div>
                        <span class="reservations-list__name">${nome}</span>
                        <span class="reservations-list__meta">
                            ${ora} · ${tavolo} · ${persone} pers.
                        </span>
                    </div>
                    <button type="button" class="link-btn link-btn--muted" data-id="${p.id}">
                        Cancella
                    </button>
                </div>
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

    const tavoloValue = document.getElementById("tavolo-prenotazione").value;
    const oraValue = document.getElementById("ora-prenotazione").value;

    const dati = {
        nome: document.getElementById("nome-cliente").value.trim(),
        ora: oraValue.length === 5 ? oraValue + ":00" : oraValue,
        persone: Number(document.getElementById("persone").value),
        tavoloId: tavoloValue === "" ? null : Number(tavoloValue),
        data: new Date().toISOString().split("T")[0],
        totale: 0
    };

    console.log("Dati inviati al backend:", dati);

    try {
        await creaPrenotazione(dati);
        await caricaLista();

        document.getElementById("form-prenotazione").reset();
    } catch (err) {
        console.error("Errore salvataggio prenotazione:", err);
        alert("Errore salvataggio prenotazione: " + err.message);
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