// ============================================================
// dashboard-api.js — collega la Dashboard HTML al backend Java
// Salva in: src/main/resources/static/dashboard-api.js
// Funziona con il tuo index.html attuale, anche senza aggiungere id.
// ============================================================

const API_BASE = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'http://localhost:8080';

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
    const response = await fetch(API_BASE + url, {
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
            </li>
        `;
        return;
    }

    lista.innerHTML = prenotazioni.map(p => {
        // Estraiamo solo l'ora dalla stringa dataOra (es: "2026-07-23T23:00:00")
        const ora = p.dataOra ? p.dataOra.split('T')[1].substring(0, 5) : "--:--";

        return `
            <li class="reservations-list__item">
                <span class="reservations-list__name">${p.nomeCliente}</span>
                <span class="reservations-list__meta">${ora} · Tavolo ${p.idTavolo} · ${p.numeroPersone} pers.</span>
            </li>
        `;
    }).join("");
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
        const dati = await richiesta("/api/dashboard");

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

    try {
        if (stato === "LIBERO" || stato === "PRENOTATO") {
            const scelta = prompt(
                `Tavolo ${numero}\n\n` +
                "1 = Apri ordine e occupa tavolo\n" +
                "2 = Segna prenotato\n" +
                "3 = Segna non disponibile\n" +
                "4 = Lascia libero"
            );

            if (scelta === "1") {
                await richiesta("/api/ordini", {
                    method: "POST",
                    body: JSON.stringify({ tavoloId: Number(tavoloId) })
                });
            } else if (scelta === "2") {
                await cambiaStatoManuale(tavoloId, "PRENOTATO");
            } else if (scelta === "3") {
                await cambiaStatoManuale(tavoloId, "NON_DISPONIBILE");
            } else if (scelta === "4") {
                await cambiaStatoManuale(tavoloId, "LIBERO");
            }
        } else if (stato === "OCCUPATO") {
            const ordine = await trovaOrdineAttivoPerTavolo(tavoloId);

            const scelta = prompt(
                `Tavolo ${numero} occupato\n\n` +
                "1 = Invia ordine in cucina\n" +
                "2 = Segna ordine pronto\n" +
                "3 = Paga ordine e libera tavolo\n" +
                "4 = Annulla ordine e libera tavolo\n" +
                "5 = Libera tavolo manualmente"
            );

            if (!ordine && scelta !== "5") {
                alert("Non trovo un ordine attivo per questo tavolo. Uso cambio stato manuale.");
                await cambiaStatoManuale(tavoloId, "LIBERO");
            } else if (scelta === "1") {
                await richiesta(`/api/ordini/${ordine.id}/in-cucina`, { method: "PUT" });
            } else if (scelta === "2") {
                await richiesta(`/api/ordini/${ordine.id}/pronto`, { method: "PUT" });
            } else if (scelta === "3") {
                await richiesta(`/api/ordini/${ordine.id}/paga`, { method: "PUT" });
            } else if (scelta === "4") {
                await richiesta(`/api/ordini/${ordine.id}`, { method: "DELETE" });
            } else if (scelta === "5") {
                await cambiaStatoManuale(tavoloId, "LIBERO");
            }
        } else if (stato === "NON_DISPONIBILE") {
            const conferma = confirm(`Rendere disponibile il tavolo ${numero}?`);
            if (conferma) {
                await cambiaStatoManuale(tavoloId, "LIBERO");
            }
        }

        await caricaDashboard();
    } catch (errore) {
        console.error(errore);
        alert("Operazione non riuscita: " + errore.message);
    }
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
