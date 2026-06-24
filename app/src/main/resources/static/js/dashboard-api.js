// ============================================================
// dashboard-api.js — collega la Dashboard HTML al backend Java
// Salva in: src/main/resources/static/dashboard-api.js
// Funziona con il tuo index.html attuale, anche senza aggiungere id.
// ============================================================

const DASHBOARD_ORIGIN = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'http://localhost:8080';

function euro(valore) {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR"
    }).format(Number(valore || 0));
}

function statoOrdineLabel(stato) {
    const map = {
        APERTO: "Aperto",
        IN_CUCINA: "In cucina",
        PRONTO: "Pronto",
        PAGATO: "Pagato",
        ANNULLATO: "Annullato"
    };
    return map[stato] || stato || "Aperto";
}

function statoTavoloLabel(stato) {
    const map = {
        LIBERO: "libero",
        OCCUPATO: "occupato",
        PRENOTATO: "prenotato",
        NON_DISPONIBILE: "non disponibile"
    };
    return map[stato] || "libero";
}

function badgeClass(stato) {
    if (stato === "IN_CUCINA" || stato === "In cucina") return "status-badge status-badge--kitchen";
    if (stato === "PRONTO" || stato === "Pronto") return "status-badge status-badge--ready";
    return "status-badge status-badge--open";
}

async function richiesta(url, opzioni = {}) {
    const response = await fetch(DASHBOARD_ORIGIN + url, {
        headers: {
            "Content-Type": "application/json",
            ...(opzioni.headers || {})
        },
        ...opzioni
    });

    if (!response.ok) {
        let messaggio = "Errore richiesta: " + response.status;
        try {
            const testo = await response.text();
            if (testo) messaggio = testo;
        } catch (e) {}
        throw new Error(messaggio);
    }

    if (response.status === 204) return null;

    const testo = await response.text();
    return testo ? JSON.parse(testo) : null;
}

function aggiornaKpi(dati) {
    const valori = document.querySelectorAll(".kpi-card__value");
    const sottotesti = document.querySelectorAll(".kpi-card__subtext");

    if (valori[0]) valori[0].textContent = euro(dati.incassoOggi);
    if (valori[1]) valori[1].textContent = `${dati.tavoliOccupati} / ${dati.tavoliTotali}`;
    if (valori[2]) valori[2].textContent = dati.ordiniAttivi;
    if (valori[3]) valori[3].textContent = dati.prenotazioniOggi;

    if (sottotesti[0]) sottotesti[0].textContent = "Ordini pagati oggi";
    if (sottotesti[1]) sottotesti[1].textContent = `${dati.percentualeOccupazione}% occupazione`;
    if (sottotesti[2]) sottotesti[2].textContent = `${dati.ordiniInCucina} in cucina`;
    if (sottotesti[3]) sottotesti[3].textContent = "Per oggi";
}

function aggiornaOrdini(dati) {
    const lista = document.querySelector(".orders-list");
    if (!lista) return;

    const ordini = dati.ordiniAttiviLista || [];

    if (ordini.length === 0) {
        lista.innerHTML = `
            <li class="orders-list__item">
                <div class="orders-list__info">
                    <span class="orders-list__table">Nessun ordine attivo</span>
                    <span class="orders-list__details">La sala è libera</span>
                </div>
                <span class="status-badge status-badge--open">OK</span>
            </li>
        `;
        return;
    }

    lista.innerHTML = ordini.map(ordine => `
        <li class="orders-list__item">
            <div class="orders-list__info">
                <span class="orders-list__table">Tavolo ${ordine.tavoloNumero}</span>
                <span class="orders-list__details">${ordine.piatti} piatti · ${euro(ordine.totale)}</span>
            </div>
            <span class="${badgeClass(ordine.stato)}">${statoOrdineLabel(ordine.stato)}</span>
        </li>
    `).join("");
}

function aggiornaPrenotazioni(dati) {
    const lista = document.querySelector(".reservations-list");
    if (!lista) return;

    const prenotazioni = dati.prossimePrenotazioni || [];

    if (prenotazioni.length === 0) {
        lista.innerHTML = `
            <li class="reservations-list__item">
                <span class="reservations-list__name">Nessuna prenotazione</span>
                <span class="reservations-list__meta">Non ci sono prenotazioni per oggi</span>
            </li>
        `;
        return;
    }

    lista.innerHTML = prenotazioni.map(p => `
        <li class="reservations-list__item">
            <span class="reservations-list__name">${p.nome}</span>
            <span class="reservations-list__meta">${p.ora} · Tavolo ${p.tavoloNumero} · ${p.persone} pers.</span>
        </li>
    `).join("");
}

function pulisciClassiTavolo(bottone) {
    bottone.classList.remove(
        "table--free",
        "table--occupied",
        "table--reserved",
        "table--unavailable"
    );
}

function applicaStatoTavolo(bottone, stato) {
    pulisciClassiTavolo(bottone);

    if (stato === "OCCUPATO") {
        bottone.classList.add("table--occupied");
        bottone.disabled = false;
    } else if (stato === "PRENOTATO") {
        bottone.classList.add("table--reserved");
        bottone.disabled = false;
    } else if (stato === "NON_DISPONIBILE") {
        bottone.classList.add("table--unavailable");
        bottone.disabled = true;
    } else {
        bottone.classList.add("table--free");
        bottone.disabled = false;
    }

    const numero = bottone.textContent.trim();
    bottone.setAttribute("aria-label", `Tavolo ${numero}, ${statoTavoloLabel(stato)}`);
    bottone.dataset.stato = stato;
}

async function aggiornaTavoli() {
    const tavoli = await richiesta("/api/tavoli");
    const bottoni = document.querySelectorAll(".table");

    bottoni.forEach(bottone => {
        const numero = Number(bottone.textContent.trim());
        const tavolo = tavoli.find(t => Number(t.numero) === numero);

        if (!tavolo) return;

        bottone.dataset.tavoloId = tavolo.id;
        bottone.dataset.numero = tavolo.numero;
        applicaStatoTavolo(bottone, tavolo.stato);
    });
}

async function caricaDashboard() {
    try {
        let dati = await richiesta("/api/dashboard");

        if (typeof window.filtraOrdiniSessioneCorrente === 'function' && dati.ordiniAttiviLista) {
            dati.ordiniAttiviLista = window.filtraOrdiniSessioneCorrente(dati.ordiniAttiviLista);
            dati.ordiniAttivi = dati.ordiniAttiviLista.length;
            dati.ordiniInCucina = dati.ordiniAttiviLista.filter(function (o) {
                return o.stato === 'IN_CUCINA' || o.stato === 'In cucina';
            }).length;
        }

        if (typeof window.incassoSessioneCorrente === 'function') {
            dati.incassoOggi = window.incassoSessioneCorrente(dati.incassoOggi);
        }

        aggiornaKpi(dati);
        aggiornaOrdini(dati);
        aggiornaPrenotazioni(dati);
        await aggiornaTavoli();

        console.log("Dashboard aggiornata", dati);
    } catch (errore) {
        console.error("Errore dashboard:", errore);
    }
}

async function cambiaStatoManuale(tavoloId, stato) {
    await richiesta(`/api/tavoli/${tavoloId}/stato`, {
        method: "PUT",
        body: JSON.stringify({ stato })
    });
}

async function trovaOrdineAttivoPerTavolo(tavoloId) {
    const ordini = await richiesta("/api/ordini?attivi=true");
    return ordini.find(o => String(o.tavoloId) === String(tavoloId));
}

async function gestisciClickTavolo(evento) {
    const bottone = evento.target.closest(".table");
    if (!bottone) return;

    const tavoloId = bottone.dataset.tavoloId;
    const numero = bottone.dataset.numero || bottone.textContent.trim();
    const stato = bottone.dataset.stato;

    if (!tavoloId) {
        alert("Tavolo non collegato al backend. Ricarica la pagina.");
        return;
    }

    if (typeof apriModaleTavolo !== "function") {
        alert("Modale tavolo non disponibile. Ricarica la pagina.");
        return;
    }

    apriModaleTavolo({
        tavoloId: Number(tavoloId),
        numero: Number(numero) || numero,
        stato: stato,
        onSalvato: async function () {
            await caricaDashboard();
        }
    });
}

function inizializzaClickTavoli() {
    document.querySelectorAll(".table").forEach(bottone => {
        bottone.addEventListener("click", gestisciClickTavolo);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    inizializzaClickTavoli();
    caricaDashboard();

    // Aggiorna automaticamente ogni 5 secondi.
    setInterval(caricaDashboard, 5000);
});
