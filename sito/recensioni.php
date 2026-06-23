<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "ristorante_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// SALVATAGGIO DELLA NUOVA RECENSIONE (Richiesta AJAX POST)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['azione']) && $_POST['azione'] == 'inserisci_recensione') {
    $nome = $conn->real_escape_string($_POST['nome']);
    $voto = intval($_POST['voto']);
    $testo = $conn->real_escape_string($_POST['testo']);
    
    // CORREZIONE: Salviamo nel formato nativo SQL (Es: 2026-06-22)
    $data_db = date("Y-m-d");
    
    // Generiamo anche la versione testuale italiana per la risposta AJAX immediata
    $mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    $data_italiana = date('j') . ' ' . $mesi[date('n')-1] . ' ' . date('Y');

    $sqlInsert = "INSERT INTO feedback (nome, voto, commento, data_invio) VALUES ('$nome', $voto, '$testo', '$data_db')";
    
    if ($conn->query($sqlInsert) === TRUE) {
        echo json_serialize_response("SUCCESS", $nome, $voto, $testo, $data_italiana);
        exit;
    } else {
        echo json_serialize_response("ERRORE: " . $conn->error);
        exit;
    }
}

// Funzione di supporto per rispondere velocemente in JSON alle chiamate AJAX
function json_serialize_response($stato="", $nome="", $voto=5, $commento="", $data="") {
    return json_encode([
        "stato" => $stato,
        "nome" => $nome,
        "voto" => $voto,
        "commento" => $commento,
        "data" => $data
    ]);
}

// RECUPERO DELLE RECENSIONI DAL DATABASE
$recensioniCaricate = [];
$sqlSelect = "SELECT nome, voto, commento, data_invio FROM feedback ORDER BY id_recensione DESC";
$res = $conn->query($sqlSelect);

if ($res && $res->num_rows > 0) {
    $mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    while ($row = $res->fetch_assoc()) {
        // Prendiamo la data SQL (aaaa-mm-gg) e la convertiamo al volo in italiano per JS
        $timestamp = strtotime($row['data_invio']);
        if ($timestamp) {
            $row['data'] = date('j', $timestamp) . ' ' . $mesi[date('n', $timestamp)-1] . ' ' . date('Y', $timestamp);
        } else {
            $row['data'] = "Recentemente";
        }
        $recensioniCaricate[] = $row;
    }
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
    $sql = "SELECT COUNT(*) as totale_stella FROM feedback WHERE voto = $stella";
    $res = $conn->query($sql);
    if ($res && $row = $res->fetch_assoc()) {
        return round(($row['totale_stella'] / $totaleRecensioni) * 100);
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
        <?php $totaleRecensioni = getTotaleRecensioni($conn); ?>
        
        <div class="reviews-summary">
            <div class="rating-huge">
                <div class="number">4.8</div>
                <div class="stars">★★★★★</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">Su <?php echo $totaleRecensioni ?> Recensioni</div>
            </div>

            <div class="rating-bars">
                <?php for($i = 5; $i >= 1; $i--): 
                    $pct = calcolaPercentualeStella($conn, $i, $totaleRecensioni); ?>
                    <div class="bar-item">
                        <span><?php echo $i; ?> ★</span>
                        <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $pct; ?>%"></div></div>
                        <span><?php echo $pct; ?>%</span>
                    </div>
                <?php endfor; ?>
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
                    <textarea id="review-message" name="testo" rows="5" required placeholder="Cosa ti è piaciuto di più?"></textarea>
                </div>
                <button type="submit">Invia Recensione</button>
            </form>
        </div>

        <br><br>
        <h3>Recensioni</h3>
        <div class="reviews-list" id="lista-recensioni"></div> //print delle recensioni
    </div>

    <script>
        const recensioniIniziali = <?php echo json_encode($recensioniCaricate); ?>;
        const listaDOM = document.getElementById('lista-recensioni');

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
            if (str === null || str === undefined) return "";
            return String(str).replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '/\r?\n/g': '<br>'}[tag] || tag)
            );
        }

        function inizializzaPagina() {
            recensioniIniziali.forEach(r => renderizzaRecensione(r));
        }

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
                    const nuovaRecensione = {
                        nome: data.nome,
                        voto: data.voto,
                        commento: data.commento,
                        data: data.data
                    };
                    renderizzaRecensione(nuovaRecensione, true);
                    alert("Grazie! Recensione salvata e pubblicata.");
                    this.reset();
                } else {
                    alert("Errore durante il salvataggio: " + data.stato);
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                alert("Si è verificato un errore di rete.");
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            inizializzaPagina();
        });
    </script>
</body>
</html>
<?php $conn->close(); ?>