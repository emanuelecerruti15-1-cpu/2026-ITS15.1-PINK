<?php
    // 1. CONNESSIONE AL DATABASE
    $host = "localhost";
    $user = "root";
    $password = "";
    $dbname = "ristorante_db"; // Ricordati di cambiarlo se il DB ha un altro nome

    $conn = new mysqli($host, $user, $password, $dbname);

    // Se la connessione fallisce, mostra l'errore
    if ($conn->connect_error) {
        die("Connessione fallita: " . $conn->connect_error);
    }

    // FUNZIONE PER STAMPARE I PIATTI DAL DB
    function stampaCategoria($conn, $categoria) {
        $sql = "SELECT nome, prezzo FROM menu WHERE categoria = '$categoria' AND disponibile = 1";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $prezzoFormattato = number_format($row['prezzo'], 2, ',', '.');
                
                echo '<div class="menu-item">';
                echo '    <div class="item-main">';
                echo '        <span class="item-name">' . htmlspecialchars($row['nome']) . '</span>';
                echo '        <span class="item-price">€ ' . $prezzoFormattato . '</span>';
                echo '    </div>';
                echo '</div>';
            }
        } else {
            echo '<p style="color:gray; font-style:italic; padding-left: 20px;">Nessun piatto disponibile al momento.</p>';
        }
    }
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu a Pagine - Trattoria da Ignazio</title>
    <link rel="stylesheet" href="assets/menu.css">
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&display=swap" rel="stylesheet">
    
    <style>
        /* FIX FRECCE: Forza i pulsanti di navigazione a stare sopra le pagine del menu */
        .nav-btn {
            z-index: 9999 !important;
            cursor: pointer;
            opacity: 1 !important;
            display: block !important;
        }
        .book-container {
            position: relative;
        }
    </style>
</head>
<body>

    <div class="book-container">
        
        <div class="menu-page active" id="page-1">
            <header class="menu-header">
                <div class="logo-cerchio">
                    <p class="logo-sub">Cucina Mediterranea</p>
                    <h1 class="logo-titolo">da Ignazio</h1>
                </div>
            </header>
            
            <section class="menu-section">
                <h2 class="section-title">Antipasti</h2>
                <?php stampaCategoria($conn, 'ANTIPASTO'); ?>
            </section>
            <div class="page-number">Pagina 1 di 5</div>
        </div>

        <div class="menu-page" id="page-2">
            <section class="menu-section">
                <h2 class="section-title">Primi Piatti</h2>
                <?php stampaCategoria($conn, 'PRIMO'); ?>
            </section>
            <div class="page-number">Pagina 2 di 5</div>
        </div>

        <div class="menu-page" id="page-3">
            <section class="menu-section">
                <h2 class="section-title">Secondi Piatti</h2>
                <?php stampaCategoria($conn, 'SECONDO'); ?>
            </section>
            <div class="page-number">Pagina 3 di 5</div>
        </div>

        <div class="menu-page" id="page-4">
            <section class="menu-section">
                <h2 class="section-title">I Nostri Vini</h2>
                
                <?php
                $sqlVini = "SELECT nome, prezzo, note FROM menu WHERE categoria = 'VINO' AND disponibile = 1 ORDER BY note";
                $resVini = $conn->query($sqlVini);
                $produttoreCorrente = "";

                if ($resVini && $resVini->num_rows > 0) {
                    while($vino = $resVini->fetch_assoc()) {
                        // Se c'è un produttore scritto nelle note e cambia rispetto al precedente, stampa il titolo del produttore
                        if (!empty($vino['note']) && $vino['note'] !== $produttoreCorrente) {
                            $produttoreCorrente = $vino['note'];
                            echo '<div class="wine-producer">' . htmlspecialchars($produttoreCorrente) . '</div>';
                        }
                        echo '<div class="menu-item">';
                        echo '    <div class="item-main">';
                        echo '        <span class="item-name-wine">' . htmlspecialchars($vino['nome']) . '</span>';
                        echo '        <span class="item-price">€ ' . number_format($vino['prezzo'], 2, ',', '.') . '</span>';
                        echo '    </div>';
                        echo '</div>';
                    }
                } else {
                    // Fallback semplice se non ci sono vini raggruppati per nota
                    stampaCategoria($conn, 'VINO');
                }
                ?>
            </section>
            <div class="page-number">Pagina 4 di 5</div>
        </div>

        <div class="menu-page" id="page-5">
            <section class="menu-section">
                <h2 class="section-title">Dolci & Bevande</h2>
                <?php stampaCategoria($conn, 'DOLCE_BEVANDA'); ?>
            </section>

            <div class="coperto">
                <p>Coperto e servizio: € 2,00</p>
            </div>
            <div class="page-number">Pagina 5 di 5</div>
        </div>

        <button class="nav-btn prev-btn" id="prevBtn" onclick="changePage(-1)">&#10094;</button>
        <button class="nav-btn next-btn" id="nextBtn" onclick="changePage(1)">&#10095;</button>

    </div>

    <script>
        let currentPage = 1;
        const totalPages = 5;

        function changePage(direction) {
            document.getElementById(`page-${currentPage}`).classList.remove('active');
            
            currentPage += direction;
            
            if (currentPage > totalPages) currentPage = 1;
            if (currentPage < 1) currentPage = totalPages;
            
            document.getElementById(`page-${currentPage}`).classList.add('active');
        }
    </script>
</body>
</html>
<?php 
    // Chiudiamo la connessione alla fine della pagina
    $conn->close(); 
?>