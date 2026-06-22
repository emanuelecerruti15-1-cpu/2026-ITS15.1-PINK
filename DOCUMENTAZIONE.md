## Documentazione Progetto: Trattoria A Réva
Tecnologie Utilizzate: HTML5, CSS3, JavaScript (ES6+), PHP 8, MySQL

# 1. Introduzione ed Obiettivi del Sistema
Il progetto consiste nello sviluppo di una piattaforma web dinamica per la Trattoria A Réva. L'obiettivo principale è digitalizzare l'esperienza di prenotazione e la gestione dei feedback dei clienti, offrendo un'interfaccia moderna e intuitiva basata sulle reali dinamiche di un ristorante.

Il sistema si compone di tre funzionalità chiave:
 - Menu e Vetrina: Presentazione dei piatti tipici della tradizione ligure.
 - Gestione Recensioni: Un sistema di feedback globale salvato su database con calcolo dinamico delle valutazioni degli utenti.
 - Prenotazione Tavoli Interattiva: Una planimetria digitale (Sala Interna ed Esterno) che permette al cliente di scegliere visivamente  il proprio tavolo, bloccando in tempo reale i tavoli occupati o fuori servizio.

# 2. Architettura del Database (Modello Relazionale)
Il database, denominato ristorante_db, è strutturato per garantire l'integrità dei dati e l'allineamento in tempo reale tra lo stato della sala e le prenotazioni dei clienti.

# Tabella 1: tavoli
    Contiene la configurazione strutturale della sala. Lo stato indica l'integrità fisica del tavolo, mentre la disponibilita varia dinamicamente in base alle prenotazioni.

    id_tavolo (INT, Primary Key, Auto-increment)
    tavolo (INT, Unique): Numero identificativo visibile del tavolo (es. 1, 2, 3...).
    capacita_posti (INT): Numero massimo di coperti per quel tavolo.
    disponibilita (BIT/INT): Stato temporaneo del tavolo (1 = Libero, 0 = Occupato).
    stato (VARCHAR): Stato logistico del tavolo ('attivo' = usabile, 'rotto' = in manutenzione).

# Tabella 2: prenotazioni
    Registra le sessioni di prenotazione dei clienti. È legata alla tabella tavoli tramite un vincolo di Integrità Referenziale.

    id (INT, Primary Key, Auto-increment)
    nome_cliente (VARCHAR): Nome e Cognome uniti del richiedente.
    email (VARCHAR): Indirizzo email di contatto.
    data_ora (DATETIME): Data e orario della prenotazione.
    numero_persone (INT): Numero di ospiti attesi.
    note (TEXT): Eventuali allergie o preferenze comunicate.
    id_tavolo (INT): Foreign Key collegata a tavoli(id_tavolo) con regola ON DELETE CASCADE.

# Tabella 3: recensioni
    Raccoglie i feedback inviati dagli utenti tramite il modulo del sito.

    id (INT, Primary Key, Auto-increment)
    nome (VARCHAR): Nome dell'autore del feedback.
    voto (INT): Valutazione da 1 a 5 stelle.
    commento (TEXT): Recensione testuale dell'esperienza.
    data_recensione (VARCHAR): Data di pubblicazione formattata in italiano.

# 3. Logica Applicativa e Flusso dei Dati (Data Flow)
    Il funzionamento delle pagine dinamiche si basa sull'interazione asincrona tra Client e Server tramite AJAX (Fetch API).

    Flusso di Prenotazione (prenota.php):
    Fase di Caricamento (Lettura): Al caricamento della pagina, il backend esegue una query SELECT tavolo FROM tavoli WHERE disponibilita = 0 OR stato != 'attivo'. I numeri di tavolo ottenuti vengono inseriti in un array PHP e usati per stampare le classi CSS .occupied sui rispettivi elementi della mappa HTML, rendendoli grigi e non cliccabili.

    Fase di Invio (Scrittura): Quando l'utente seleziona un tavolo blu e conferma, JavaScript intercetta l'evento (e.preventDefault()), impacchetta i dati del form dentro un oggetto FormData e invia una richiesta POST asincrona in background a prenota.php.

    Elaborazione Server: Il codice PHP valida i campi, unisce le stringhe di Nome/Cognome e Data/Ora e interroga il database per tradurre il numero del tavolo cliccato nel rispettivo id_tavolo interno. Se i controlli della Foreign Key hanno successo, inserisce la prenotazione e restituisce la stringa "SUCCESS".

    Risposta Client: JavaScript riceve il responso positivo, mostra un alert di successo, resetta il form e ricarica la pagina per aggiornare istantaneamente la piantina con il nuovo tavolo occupato.

# 4. Manuale di Installazione e Distribuzione Locale
    Per eseguire il progetto in ambiente di test locale, seguire i seguenti passaggi:

    Configurazione dei File:
    - Installare l'ambiente di sviluppo XAMPP (con PHP 8+ e MySQL).
    - Clonare o copiare la cartella del progetto all'interno della directory C:\xampp\htdocs.

    Inizializzazione del Database:
    - Avviare i moduli Apache e MySQL dal pannello di controllo di XAMPP.
    - Navigare su http://localhost/phpmyadmin/ e creare un nuovo database chiamato ristorante_db con codifica utf8mb4_general_ci.
    - Importare le tabelle eseguendo gli script SQL dedicati.

    Popolamento Dati:
    - Eseguire la query INSERT INTO per registrare la planimetria iniziale degli 8 tavoli attivi di default del ristorante.

    Esecuzione:
    - Aprire il browser e digitare l'indirizzo: http://localhost/trattoria-areva/index.html.