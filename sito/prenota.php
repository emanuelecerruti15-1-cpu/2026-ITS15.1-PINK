<?php
//CONNESSIONE AL DATABASE
$host = "localhost";
$user = "root";
$password = "";
$dbname = "ristorante_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// SALVATAGGIO DELLA PRENOTAZIONE (AJAX POST)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['azione']) && $_POST['azione'] == 'salva_prenotazione') {
    $nome = $conn->real_escape_string($_POST['nome']);
    $cognome = $conn->real_escape_string($_POST['cognome']);
    $email = $conn->real_escape_string($_POST['email']);
    $data = $conn->real_escape_string($_POST['data']);
    $orario = $conn->real_escape_string($_POST['orario']);
    $persone = $conn->real_escape_string($_POST['persone']);
    $note = $conn->real_escape_string($_POST['note']);
    
    // Questo è il numero del tavolo cliccato (es. 1, 3, 4...)
    $numero_tavolo_cliccato = intval($_POST['tavolo_id']); 


    $sqlCercaId = "SELECT id_tavolo FROM tavoli WHERE tavolo = $numero_tavolo_cliccato LIMIT 1";
    $risultatoId = $conn->query($sqlCercaId);

    if ($risultatoId && $risultatoId->num_rows > 0) {
        $rigaTavolo = $risultatoId->fetch_assoc();
        $vero_id_tavolo = $rigaTavolo['id_tavolo']; // Trovato! l'ID per la FK
    } else {
        // Se non trova il tavolo nel DB, restituisce un errore chiaro invece di failare bruscamente
        echo "ERRORE: Il tavolo numero $numero_tavolo_cliccato non esiste nel database dei tavoli.";
        exit;
    }
    // ------------------------------

    $nome_completo = $nome . " " . $cognome;
    $data_ora_completa = $data . " " . $orario;

    $sqlInsert = "INSERT INTO prenotazioni (nome_cliente, email, data_ora, numero_persone, note, id_tavolo) 
                  VALUES ('$nome_completo', '$email', '$data_ora_completa', '$persone', '$note', $vero_id_tavolo)";

    if ($conn->query($sqlInsert) === TRUE) {
        echo "SUCCESS";
        exit;
    } else {
        echo "ERRORE DB: " . $conn->error;
        exit;
    }
}

// RECUPERO STATO TAVOLI OCCUPATI
$tavoliOccupati = [];

// Prendiamo i tavoli che sono occupati (disponibilita = 0) OPPURE fuori servizio (stato diverso da 'attivo')
$sqlTavoli = "SELECT tavolo FROM tavoli WHERE disponibilita = 0 OR stato != 'attivo'"; 
$resTavoli = $conn->query($sqlTavoli);

if ($resTavoli && $resTavoli->num_rows > 0) {
    while ($tavolo = $resTavoli->fetch_assoc()) {
        $tavoliOccupati[] = $tavolo['tavolo']; 
    }
}

// Funzione helper per generare i tavoli nella mappa graficamente
function generaTavoloMappa($numero, $forma, $tavoliOccupati) {
    if (in_array($numero, $tavoliOccupati)) {
        echo '<div class="table-item ' . $forma . ' occupied">T' . $numero . '</div>';
    } else {
        echo '<div class="table-item ' . $forma . ' free" data-table="' . $numero . '">T' . $numero . '</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prenota un Tavolo - Trattoria A Réva</title>
    <link rel="stylesheet" href="assets/prenota.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>

   <div class="booking-container"> 
        <a href="index.html" class="btn-back-home">&larr; Torna alla Home</a>

        <h2>Prenota un Tavolo</h2>
        <p class="subtitle">Trattoria A Réva — Inserisci i tuoi dati</p>
        
        <form id="form-prenotazione">
            <div class="form-grid">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input type="text" id="name" name="nome" placeholder="Es. Mario" required>
                </div>

                <div class="form-group">
                    <label for="surname">Cognome</label>
                    <input type="text" id="surname" name="cognome" placeholder="Es. Rossi" required>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="esempio@email.com" required>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="data">Data</label>
                    <input type="date" id="data" name="data" required>
                </div>

                <div class="form-group">
                    <label for="orario">Orario</label>
                    <select id="orario" name="orario" required>
                        <option value="" disabled selected>Orario</option>    
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">13:00</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                        <option value="19:00">19:00</option>
                        <option value="19:30">19:30</option>
                        <option value="20:00">20:00</option>
                        <option value="20:30">20:30</option>
                        <option value="21:00">21:00</option>
                    </select>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="guests">Numero di persone</label>
                    <select id="guests" name="persone" required>
                        <option value="" disabled selected>Quanti siete?</option>
                        <option value="1">1 Persona</option>
                        <option value="2">2 Persone</option>
                        <option value="3">3 Persone</option>
                        <option value="4">4 Persone</option>
                        <option value="5">5 Persone</option>
                        <option value="6">6 Persone</option>
                        <option value="7+">Più di 6 persone</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="note">Note Speciali</label>
                    <input type="text" id="note" name="note" placeholder="Es. Allergie, preferenze...">
                </div>
            </div>
             
            <!-- Cambiato in type="button" per evitare svuotamenti della pagina improvvisi -->
            <button type="button" id="prenota">SCEGLI IL TAVOLO</button>
        </form>
    </div>

    <div id="custom-modal" class="modal-overlay">
        <div class="modal-box">
            <h3>Planimetria Sala</h3>
            <p class="modal-subtitle">Seleziona il tavolo che preferisci per il tuo soggiorno</p>

            <div class="legend">
                <div class="legend-item"><span class="status-dot free"></span> Libero</div>
                <div class="legend-item"><span class="status-dot selected"></span> Selezionato</div>
                <div class="legend-item"><span class="status-dot occupied"></span> Occupato</div>
            </div>

            <div class="room-map">
                <div class="map-zone-title">Esterno</div>
                <div class="tables-layout">
                    <?php generaTavoloMappa(1, 'table-round', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(2, 'table-square', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(3, 'table-square', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(4, 'table-rect', $tavoliOccupati); ?>
                </div>

                <div class="map-zone-title" style="margin-top: 30px;">Sala Interna</div>
                <div class="tables-layout">
                    <?php generaTavoloMappa(5, 'table-rect', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(6, 'table-round', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(7, 'table-square', $tavoliOccupati); ?>
                    <?php generaTavoloMappa(8, 'table-rect', $tavoliOccupati); ?>
                </div>
            </div>

            <div class="modal-actions">
                <button id="back-to-form" class="btn-secondary">Indietro</button>
                <button id="confirm-booking" class="btn-main" disabled>Conferma Prenotazione</button>
            </div>
        </div>
    </div>

<script>
    const form = document.getElementById('form-prenotazione');
    const selectGuests = document.getElementById('guests');
    const btnPrenota = document.getElementById('prenota');
    const inputData = document.getElementById('data');
    
    const modal = document.getElementById('custom-modal');
    const backBtn = document.getElementById('back-to-form');
    const confirmBtn = document.getElementById('confirm-booking');
    const tableItems = document.querySelectorAll('.table-item.free');
    
    let tavoloSelezionato = null;

    // Imposta data minima = oggi
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    const dataOggiString = `${anno}-${mese}-${giorno}`;
    inputData.min = dataOggiString;

    // Gestione click del primo pulsante (Scegli il Tavolo) senza submit nativo
    btnPrenota.addEventListener('click', () => {
        if (form.checkValidity()) {
            modal.classList.add('active');
        } else {
            form.reportValidity(); // Evidenzia i campi mancanti se l'utente salta qualcosa
        }
    });

    // Selezione del tavolo libero sulla piantina
    tableItems.forEach(table => {
        table.addEventListener('click', () => {
            tableItems.forEach(t => t.classList.remove('selected-table'));
            table.classList.add('selected-table');
            tavoloSelezionato = table.getAttribute('data-table');
            confirmBtn.disabled = false;
        });
    });

    // Tasto Indietro dal modale
    backBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Conferma finale e invio dati asincrono al PHP (AJAX)
    confirmBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        formData.append('azione', 'salva_prenotazione');
        formData.append('tavolo_id', tavoloSelezionato);

        fetch(window.location.href, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.trim() === "SUCCESS") {
                const nome = document.getElementById('name').value;
                alert("Grazie " + nome + "! Prenotazione salvata nel database al Tavolo " + tavoloSelezionato + ".");
                
                // Reset grafico completo
                modal.classList.remove('active');
                tableItems.forEach(t => t.classList.remove('selected-table'));
                tavoloSelezionato = null;
                confirmBtn.disabled = true;
                form.reset();
                
                // Ricarica la pagina per mostrare il tavolo appena occupato in rosso
                window.location.reload();
            } else {
                // Sostituito il vecchio concatenamento del punto col PIU (+), addio undefined!
                alert("Errore durante il salvataggio:\n" + data);
            }
        })
        .catch(error => {
            console.error('Errore:', error);
            alert("Si è verificato un errore di rete.");
        });
    });
</script>
</body>
</html>
<?php $conn->close(); ?>