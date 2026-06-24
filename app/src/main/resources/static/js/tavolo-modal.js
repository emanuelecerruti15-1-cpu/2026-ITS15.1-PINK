/* ================================================================
   MODALE TAVOLO — Riepilogo e gestione stato (Dashboard + Tavoli)
   ================================================================ */

(function () {
    let tavoloCorrente = null;
    let ordineCorrente = null;
    let prenotazioneCorrente = null;
    let statoAttuale = 'LIBERO';
    let statoSelezionato = 'LIBERO';
    let callbackSalvato = null;
    let salvataggioCustom = null;

    const TESTI_STATO = {
        LIBERO: 'Libero',
        OCCUPATO: 'Occupato',
        PRENOTATO: 'Prenotato',
        NON_DISPONIBILE: 'Non disponibile'
    };

    const CLASSE_ICONA = {
        LIBERO: '',
        OCCUPATO: 'tavolo-modal__icon--occupied',
        PRENOTATO: 'tavolo-modal__icon--reserved',
        NON_DISPONIBILE: 'tavolo-modal__icon--unavailable'
    };

    const CLASSE_DOT = {
        LIBERO: 'tavolo-modal__stato-dot--libero',
        OCCUPATO: 'tavolo-modal__stato-dot--occupato',
        PRENOTATO: 'tavolo-modal__stato-dot--prenotato',
        NON_DISPONIBILE: 'tavolo-modal__stato-dot--non-disp'
    };

    document.addEventListener('DOMContentLoaded', function () {
        creaModaleTavolo();
    });

    function creaModaleTavolo() {
        if (document.getElementById('modal-tavolo')) return;

        document.body.insertAdjacentHTML('beforeend',
            '<div class="tavolo-modal is-hidden" id="modal-tavolo" role="dialog" aria-modal="true" aria-labelledby="modal-tavolo-titolo">' +
                '<div class="tavolo-modal__backdrop" id="modal-tavolo-backdrop"></div>' +
                '<div class="tavolo-modal__panel">' +
                    '<button type="button" class="tavolo-modal__close" id="modal-tavolo-chiudi" aria-label="Chiudi">✕</button>' +
                    '<div class="tavolo-modal__header">' +
                        '<div class="tavolo-modal__icon" id="modal-tavolo-icon">' +
                            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4M4 10h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM8 14v4M16 14v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
                        '</div>' +
                        '<div class="tavolo-modal__head-text">' +
                            '<h2 class="tavolo-modal__title" id="modal-tavolo-titolo">Tavolo —</h2>' +
                            '<p class="tavolo-modal__subtitle">Riepilogo e gestione stato del tavolo</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tavolo-modal__grid">' +
                        '<div class="tavolo-modal__info">' +
                            '<div class="tavolo-modal__info-label"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>Stato attuale</div>' +
                            '<div class="tavolo-modal__info-value tavolo-modal__info-value--stato" id="modal-tavolo-stato-attuale">—</div>' +
                        '</div>' +
                        '<div class="tavolo-modal__info">' +
                            '<div class="tavolo-modal__info-label"><svg viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Posti</div>' +
                            '<div class="tavolo-modal__info-value" id="modal-tavolo-posti">—</div>' +
                        '</div>' +
                        '<div class="tavolo-modal__info">' +
                            '<div class="tavolo-modal__info-label"><svg viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>Sala</div>' +
                            '<div class="tavolo-modal__info-value" id="modal-tavolo-sala">Sala principale</div>' +
                        '</div>' +
                        '<div class="tavolo-modal__info">' +
                            '<div class="tavolo-modal__info-label"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 7h6M9 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Ordine attivo</div>' +
                            '<div class="tavolo-modal__info-value" id="modal-tavolo-ordine">Nessuno</div>' +
                        '</div>' +
                        '<div class="tavolo-modal__info tavolo-modal__info--wide">' +
                            '<div class="tavolo-modal__info-label"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Prenotazione</div>' +
                            '<div class="tavolo-modal__info-value" id="modal-tavolo-prenotazione">Nessuna</div>' +
                        '</div>' +
                    '</div>' +
                    '<h3 class="tavolo-modal__section-title">Cambia stato</h3>' +
                    '<div class="tavolo-modal__stati" id="modal-tavolo-stati" role="group" aria-label="Seleziona nuovo stato">' +
                        '<button type="button" class="tavolo-modal__stato-btn tavolo-modal__stato-btn--libero" data-stato="LIBERO">' +
                            '<span class="tavolo-modal__stato-btn__check" aria-hidden="true">✓</span>' +
                            '<span class="tavolo-modal__stato-btn__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4M4 10h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" stroke="currentColor" stroke-width="2"/></svg></span>' +
                            '<span>Libero</span>' +
                        '</button>' +
                        '<button type="button" class="tavolo-modal__stato-btn tavolo-modal__stato-btn--occupato" data-stato="OCCUPATO">' +
                            '<span class="tavolo-modal__stato-btn__check" aria-hidden="true">✓</span>' +
                            '<span class="tavolo-modal__stato-btn__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M8 6v12M8 6c0 1.5 1 2.5 2 2.5M16 6v12M16 6c0-1.5-1-3.5-2-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>' +
                            '<span>Occupato / Apri ordine</span>' +
                        '</button>' +
                        '<button type="button" class="tavolo-modal__stato-btn tavolo-modal__stato-btn--prenotato" data-stato="PRENOTATO">' +
                            '<span class="tavolo-modal__stato-btn__check" aria-hidden="true">✓</span>' +
                            '<span class="tavolo-modal__stato-btn__icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>' +
                            '<span>Prenotato</span>' +
                        '</button>' +
                        '<button type="button" class="tavolo-modal__stato-btn tavolo-modal__stato-btn--non-disp" data-stato="NON_DISPONIBILE">' +
                            '<span class="tavolo-modal__stato-btn__check" aria-hidden="true">✓</span>' +
                            '<span class="tavolo-modal__stato-btn__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></span>' +
                            '<span>Non disponibile</span>' +
                        '</button>' +
                    '</div>' +
                    '<p class="tavolo-modal__hint is-hidden" id="modal-tavolo-hint">' +
                        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
                        '<span>Se imposti Occupato, potrai aprire un nuovo ordine per questo tavolo.</span>' +
                    '</p>' +
                    '<div class="tavolo-modal__actions">' +
                        '<button type="button" class="tavolo-modal__btn tavolo-modal__btn--ghost" id="modal-tavolo-annulla">Annulla</button>' +
                        '<button type="button" class="tavolo-modal__btn tavolo-modal__btn--primary" id="modal-tavolo-salva">Salva modifiche</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        document.getElementById('modal-tavolo-chiudi').addEventListener('click', chiudiModaleTavolo);
        document.getElementById('modal-tavolo-backdrop').addEventListener('click', chiudiModaleTavolo);
        document.getElementById('modal-tavolo-annulla').addEventListener('click', chiudiModaleTavolo);
        document.getElementById('modal-tavolo-salva').addEventListener('click', salvaModaleTavolo);

        document.getElementById('modal-tavolo-stati').addEventListener('click', function (e) {
            const btn = e.target.closest('[data-stato]');
            if (!btn) return;
            impostaStatoSelezione(btn.dataset.stato);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !document.getElementById('modal-tavolo').classList.contains('is-hidden')) {
                chiudiModaleTavolo();
            }
        });
    }

    function formattaEuroModal(val) {
        if (typeof formattaEuro === 'function') return formattaEuro(val);
        return '€ ' + Number(val || 0).toFixed(2).replace('.', ',');
    }

    function testoOrdineAttivo(ordine) {
        if (!ordine) return 'Nessuno';
        const stato = typeof testoStatoOrdine === 'function' ? testoStatoOrdine(ordine.stato) : (ordine.stato || 'Aperto');
        return 'Ordine #' + ordine.id + ' · ' + stato + (ordine.totale != null ? ' · ' + formattaEuroModal(ordine.totale) : '');
    }

    function testoPrenotazione(pren) {
        if (!pren) return 'Nessuna';
        const ora = pren.ora ? String(pren.ora).slice(0, 5) : '';
        const nome = pren.nome || pren.nomeCliente || 'Cliente';
        const persone = pren.persone ? pren.persone + ' pers.' : '';
        return nome + (ora ? ' · ' + ora : '') + (persone ? ' · ' + persone : '');
    }

    async function caricaDettagliTavolo(tavoloId) {
        let tavolo = null;
        let ordine = null;
        let prenotazione = null;

        if (typeof getTavoloById === 'function') {
            try {
                tavolo = await getTavoloById(tavoloId);
            } catch (e) {}
        }

        if (typeof getOrdiniAttivi === 'function') {
            try {
                const ordini = await getOrdiniAttivi();
                ordine = ordini.find(function (o) { return String(o.tavoloId) === String(tavoloId); }) || null;
            } catch (e) {}
        }

        if (typeof getPrenotazioniOggi === 'function') {
            try {
                const prenotazioni = await getPrenotazioniOggi();
                const oggi = dataOggiIso ? dataOggiIso() : new Date().toISOString().slice(0, 10);
                prenotazione = (prenotazioni || []).find(function (p) {
                    return String(p.tavoloId) === String(tavoloId) &&
                        (!p.data || String(p.data).slice(0, 10) === oggi);
                }) || null;
            } catch (e) {}
        }

        return { tavolo: tavolo, ordine: ordine, prenotazione: prenotazione };
    }

    function impostaStatoSelezione(stato) {
        statoSelezionato = stato;
        document.querySelectorAll('#modal-tavolo-stati [data-stato]').forEach(function (btn) {
            btn.classList.toggle('is-selected', btn.dataset.stato === stato);
        });
        const hint = document.getElementById('modal-tavolo-hint');
        const mostraHint = stato === 'OCCUPATO' && !ordineCorrente &&
            (statoAttuale === 'LIBERO' || statoAttuale === 'PRENOTATO');
        hint.classList.toggle('is-hidden', !mostraHint);
    }

    function renderStatoAttuale(stato) {
        const el = document.getElementById('modal-tavolo-stato-attuale');
        el.innerHTML = '<span class="tavolo-modal__stato-dot ' + (CLASSE_DOT[stato] || '') + '"></span>' +
            (TESTI_STATO[stato] || stato);
    }

    function popolaModale() {
        const icon = document.getElementById('modal-tavolo-icon');
        icon.className = 'tavolo-modal__icon ' + (CLASSE_ICONA[statoAttuale] || '');

        document.getElementById('modal-tavolo-titolo').textContent = 'Tavolo ' + (tavoloCorrente.numero || tavoloCorrente.id);
        document.getElementById('modal-tavolo-posti').textContent = String(tavoloCorrente.posti || '—');
        document.getElementById('modal-tavolo-sala').textContent = tavoloCorrente.sala || 'Sala principale';
        document.getElementById('modal-tavolo-ordine').textContent = testoOrdineAttivo(ordineCorrente);
        document.getElementById('modal-tavolo-prenotazione').textContent = testoPrenotazione(prenotazioneCorrente);
        renderStatoAttuale(statoAttuale);
        impostaStatoSelezione(statoAttuale);
    }

    function chiudiModaleTavolo() {
        document.getElementById('modal-tavolo').classList.add('is-hidden');
        tavoloCorrente = null;
        callbackSalvato = null;
        salvataggioCustom = null;
    }

    async function apriModaleTavolo(opzioni) {
        creaModaleTavolo();

        const tavoloId = opzioni.tavoloId || opzioni.id;
        if (!tavoloId) return;

        callbackSalvato = opzioni.onSalvato || null;
        salvataggioCustom = opzioni.gestisciSalvataggio || null;

        const dettagli = await caricaDettagliTavolo(tavoloId);

        tavoloCorrente = dettagli.tavolo || {
            id: tavoloId,
            numero: opzioni.numero,
            posti: opzioni.posti || '—',
            stato: opzioni.stato || 'LIBERO',
            sala: opzioni.sala || 'Sala principale'
        };

        ordineCorrente = dettagli.ordine || opzioni.ordine || null;
        prenotazioneCorrente = dettagli.prenotazione || opzioni.prenotazione || null;
        statoAttuale = tavoloCorrente.stato || opzioni.stato || 'LIBERO';

        if (ordineCorrente && statoAttuale !== 'OCCUPATO') {
            statoAttuale = 'OCCUPATO';
            tavoloCorrente.stato = 'OCCUPATO';
        }

        popolaModale();
        document.getElementById('modal-tavolo').classList.remove('is-hidden');
        document.getElementById('modal-tavolo-salva').disabled = false;
        document.getElementById('modal-tavolo-salva').textContent = 'Salva modifiche';
    }

    async function salvaModaleTavolo() {
        if (!tavoloCorrente) return;

        const btnSalva = document.getElementById('modal-tavolo-salva');
        btnSalva.disabled = true;
        btnSalva.textContent = 'Salvataggio…';

        const tavoloId = tavoloCorrente.id;
        const nuovoStato = statoSelezionato;
        const apriOrdine = nuovoStato === 'OCCUPATO' && !ordineCorrente &&
            (statoAttuale === 'LIBERO' || statoAttuale === 'PRENOTATO');

        try {
            if (typeof salvataggioCustom === 'function') {
                await salvataggioCustom({
                    tavoloId: tavoloId,
                    statoAttuale: statoAttuale,
                    nuovoStato: nuovoStato,
                    apriOrdine: apriOrdine,
                    tavolo: tavoloCorrente,
                    ordine: ordineCorrente
                });
            } else if (apriOrdine) {
                const ordine = await creaOrdine(tavoloId);
                chiudiModaleTavolo();
                if (ordine && ordine.id) {
                    window.location.href = 'ordini.html?id=' + ordine.id;
                    return;
                }
            } else if (nuovoStato !== statoAttuale) {
                await cambiaStatoTavolo(tavoloId, nuovoStato);
            }

            chiudiModaleTavolo();

            if (typeof callbackSalvato === 'function') {
                await callbackSalvato({ tavoloId: tavoloId, stato: nuovoStato });
            }
        } catch (e) {
            console.error('Errore salvataggio tavolo:', e);
            alert('Operazione non riuscita: ' + (e.message || 'errore sconosciuto'));
            btnSalva.disabled = false;
            btnSalva.textContent = 'Salva modifiche';
        }
    }

    window.apriModaleTavolo = apriModaleTavolo;
    window.chiudiModaleTavolo = chiudiModaleTavolo;
})();
