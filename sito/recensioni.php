<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "ristorante_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

//SALVATAGGIO DELLA NUOVA RECENSIONE (Richiesta AJAX POST)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['azione']) && $_POST['azione'] == 'inserisci_recensione') {
    $nome = $conn->real_escape_string($_POST['nome']);
    $voto = intval($_POST['voto']);
    $testo = $conn->real_escape_string($_POST['testo']);
    
    // Generiamo la data formattata in italiano (Es: "22 Giugno 2026")
    setlocale(LC_TIME, 'it_IT.UTF-8', 'ita');
    $data_formattata = strftime("%d %B %Y"); 
    // Se strftime dovesse dare problemi su qualche server locale, usiamo un fallback standard:
    if(!$data_formattata) {
        $mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
        $data_formattata = date('j') . ' ' . $mesi[date('n')-1] . ' ' . date('Y');
    }

    $sqlInsert = "INSERT INTO feedback (nome, voto, commento, data_invio) VALUES ('$nome', $voto, '$testo', '$data_formattata')";
    
    if ($conn->query($sqlInsert) === TRUE) {
        // Restituiamo i dati appena inseriti in formato JSON per l'aggiornamento in tempo reale del DOM
        echo json_serialize_response("SUCCESS", $nome, $voto, $testo, $data_formattata);
        exit;
    } else {
        echo json_serialize_response("ERRORE: " . $conn->error);
        exit;
    }
}

// Funzione di supporto per rispondere velocemente in JSON alle chiamate AJAX
function json_serialize_response($stato="", $nome="", $voto=5, $testo="", $data="") {
    return json_encode([
        "stato" => $stato,
        "nome" => $nome,
        "voto" => $voto,
        "testo" => $testo,
        "data" => $data
    ]);
}

//RECUPERO DELLE RECENSIONI DAL DATABASE (In ordine dalla più recente)
$recensioniCaricate = [];
$sqlSelect = "SELECT nome, voto, commento, data_invio AS data FROM feedback ORDER BY id_recensione DESC";
$res = $conn->query($sqlSelect);

if ($res && $res->num_rows > 0) {
    while ($row = $res->fetch_assoc()) {
        $recensioniCaricate[] = $row;
    }
} else {
    // Array di fallback se la tabella nel database è ancora vuota
    $recensioniCaricate = [
        [
            "nome" => "Elena M.",
            "voto" => "5",
            "testo" => "Il miglior pesto di Genova scoperto per caso tra i caruggi. Le trofie erano perfette e i pansoti in salsa di noci divini. Personale gentilissimo, ci tornerò sicuramente!",
            "data" => "12 Giugno 2026"
        ],
        [
            "nome" => "Francesco T.",
            "voto" => "5",
            "testo" => "Frittura di paranza leggerissima e croccante. Atmosfera autentica che ti fa respirare la vera tradizione ligure. Ottimo rapporto qualità prezzo.",
            "data" => "4 Maggio 2026"
        ],
        [
            "nome" => "Matteo R.",
            "voto" => "4",
            "testo" => "Farinata eccezionale appena sfornata. Consiglio caldamente di prenotare perché il locale è piccolino ma merita assolutamente.",
            "data" => "18 Aprile 2026"
        ]
    ];
}

function getTotaleRecensioni($conn) {
    $sql = "SELECT COUNT(*) as totale FROM feedback";
    $res = $conn->query($sql);
    if ($res && $row = $res->fetch_assoc()) {
        return $row['totale'];
    }
    return 0;
}

function calcolaPercentualeStella($conn, $stella, $totaleRecensioni) {
    if ($totaleRecensioni == 0) return 0;

    // Contiamo quante recensioni hanno quel voto specifico
    $sql = "SELECT COUNT(*) as totale_stella FROM feedback WHERE voto = $stella";
    $res = $conn->query($sql);
    
    if ($res && $row = $res->fetch_assoc()) {
        $quantiVoti = $row['totale_stella'];
        // Formula della percentuale: (voti specifici / voti totali) * 100
        $percentuale = ($quantiVoti / $totaleRecensioni) * 100;
        return round($percentuale); // Arrotonda il numero (es. 45% invece di 44.82%)
    }
    return 0;
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dicono di noi - Trattoria A Réva</title>
    <link rel="stylesheet" href="assets/recensioni.css">
</head>
<body>
    <div class="reviews-container"> 
        <a href="index.html" class="btn-back-home">&larr; Torna alla Home</a>

        <h2>Dicono di noi</h2>
        <p class="subtitle">Trattoria A Réva — Le esperienze dei nostri ospiti</p>
        
        <div class="reviews-summary">
            <div class="rating-huge">
                <div class="number">4.8</div>
                <div class="stars">★★★★★</div>
                <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 5px;">Su 148 recensioni</div>
            </div>


            <?php
                $totaleRecensioni = getTotaleRecensioni($conn);
            ?>
            <div class="rating-bars">
                <div class="bar-item">
                    <span>5 ★</span>
                    <?php $percentuale5Stelle = calcolaPercentualeStella($conn, 5, $totaleRecensioni)?>
                    <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $percentuale5Stelle ?>"></div></div>
                    <span><?php echo $percentuale5Stelle; ?>%</span>
                </div>
                <div class="bar-item">
                    <span>4 ★</span>
                    <?php $percentuale4Stelle = calcolaPercentualeStella($conn, 4, $totaleRecensioni)?>
                    <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $percentuale4Stelle ?>"></div></div>
                    <span><?php echo $percentuale4Stelle; ?>%</span>
                </div>
                <div class="bar-item">
                    <span>3 ★</span>
                    <?php $percentuale3Stelle = calcolaPercentualeStella($conn, 3, $totaleRecensioni)?>
                    <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $percentuale3Stelle ?>"></div></div>
                    <span><?php echo $percentuale3Stelle; ?>%</span>
                </div>
                <div class="bar-item">
                    <span>2 ★</span>
                    <?php $percentuale2Stelle = calcolaPercentualeStella($conn, 2, $totaleRecensioni)?>
                    <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $percentuale2Stelle ?>"></div></div>
                    <span><?php echo $percentuale2Stelle; ?>%</span>
                </div>
                <div class="bar-item">
                    <span>1 ★</span>
                    <?php $percentuale1Stelle = calcolaPercentualeStella($conn, 1, $totaleRecensioni)?>
                    <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $percentuale1Stelle ?>"></div></div>
                    <span><?php echo $percentuale1Stelle; ?>%</span>
                </div>
            </div>
        </div>

        <div class="add-review-section">
            <h3>Lascia la tua recensione</h3>
            
            <form id="form-recensione">
                <div class="form-group">
                    <label for="review-name">Nome e Cognome</label>
                    <input type="text" id="review-name" name="nome" required placeholder="Es. Mario Rossi">
                </div>

                <div class="form-group">
                    <label for="review-rating">Valutazione</label>
                    <select id="review-rating" name="voto" required>
                        <option value="5">5 Stelle (Eccellente)</option>
                        <option value="4">4 Stelle (Molto Buono)</option>
                        <option value="3">3 Stelle (Nella Media)</option>
                        <option value="2">2 Stelle (Scarso)</option>
                        <option value="1">1 Stella (Pessimo)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="review-message">La tua esperienza</label>
                    <textarea id="review-message" name="testo" rows="5" required placeholder="Cosa ti è piaciuto di più dei nostri piatti?"></textarea>
                </div>

                <button type="submit">Invia Recensione</button>
            </form>
        </div>

        <br>
        <br>
        <h3>Recensioni</h3>
        <!-- caricamento recensioni dal PHP -->
        <div class="reviews-list" id="lista-recensioni"></div>
    </div>


    <script>
        // Passiamo l'array generato dal PHP direttamente a JavaScript in modo pulito e sicuro
        const recensioniIniziali = <?php echo json_encode($recensioniCaricate); ?>;
        const listaDOM = document.getElementById('lista-recensioni');

        // Funzione per generare visivamente la card della recensione
        function renderizzaRecensione(review, inCima = false) {
            const votoNum = parseInt(review.voto);
            const stelle = '★'.repeat(votoNum) + '☆'.repeat(5 - votoNum);
            
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${escapeHTML(review.nome)}</span>
                    <span class="review-stars">${stelle}</span>
                </div>
                <p class="review-text">${escapeHTML(review.commento)}</p>
                <span class="review-date">${escapeHTML(review.data)}</span>
            `;

            if (inCima) {
                listaDOM.insertBefore(card, listaDOM.firstChild);
            } else {
                listaDOM.appendChild(card);
            }
        }

        function escapeHTML(str) {
            // Se il valore è null, undefined o non è una stringa, restituisce una stringa vuota
            if (str === null || str === undefined) {
                return "";
            }
            
            // Forza il valore a essere trattato come stringa per sicurezza
            return String(str).replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        }

        // Carica le recensioni sputate fuori dal database PHP
        function inizializzaPagina() {
            recensioniIniziali.forEach(r => renderizzaRecensione(r));
        }

        // Gestione dell'invio del modulo via AJAX
        document.getElementById('form-recensione').addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            formData.append('azione', 'inserisci_recensione');

            fetch(window.location.href, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.stato === "SUCCESS") {
                    // Costruiamo l'oggetto da mettere subito a schermo
                    const nuovaRecensione = {
                        nome: data.nome,
                        voto: data.voto,
                        testo: data.commento,
                        data: data.data
                    };
                    
                    // La piazza subito in cima alla lista senza ricaricare la pagina
                    renderizzaRecensione(nuovaRecensione, true);
                    alert("Grazie! La tua recensione è stata memorizzata nel database e pubblicata.");
                    this.reset();
                } else {
                    alert("Errore durante il salvataggio: " + data.stato);
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                alert("Si è verificato un errore di rete durante l'invio.");
            });
        });


        document.addEventListener('DOMContentLoaded', () => {
            inizializzaPagina();
        });
    </script>
</body>
</html>
<?php $conn->close(); ?>