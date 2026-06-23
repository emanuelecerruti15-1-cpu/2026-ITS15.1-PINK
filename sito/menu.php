<?php
    // CONNESSIONE AL DATABASE
    $host = "localhost";
    $user = "root";
    $password = "";
    $dbname = "ristorante_db";
    $conn = new mysqli($host, $user, $password, $dbname);

    // Se la connessione fallisce, mostra l'errore
    if ($conn->connect_error) {
        die("Connessione fallita: " . $conn->connect_error);
    }

    // FUNZIONE PER STAMPARE I PIATTI DAL DB
    function stampaCategoria($conn, $categoria) {
        // Se passiamo un array di categorie (utile per l'ultima pagina), usiamo l'IN di SQL
        if (is_array($categoria)) {
            $listaCategorie = "'" . implode("','", $categoria) . "'";
            $sql = "SELECT nome, prezzo, descrizione FROM menu WHERE categoria IN ($listaCategorie) AND disponibile = 1";
        } else {
            $sql = "SELECT nome, prezzo, descrizione FROM menu WHERE categoria = '$categoria' AND disponibile = 1";
        }
        
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $prezzoFormattato = number_format($row['prezzo'], 2, ',', '.');
                
                echo '<div class="menu-item">';
                echo '    <div class="item-main">';
                echo '        <span class="item-name">' . htmlspecialchars($row['nome']) . '</span>';
                echo '        <span class="item-price">€ ' . $prezzoFormattato . '</span>';
                echo '    </div>';
                // Mostra anche la descrizione se presente nel DB
                if (!empty($row['descrizione'])) {
                    echo '    <p class="item-description">' . htmlspecialchars($row['descrizione']) . '</p>';
                }
                echo '</div>';
            }
        } else {
            echo '<p style="color:gray; font-style:italic; padding-left: 20px;"> Nessun piatto disponibile al momento.</p>';
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
</head>
<body>

    <div class="book-container">
        <a href="index.html" class="back-home-btn">← Torna alla Home</a>
        <!-- PAGINA 1: ANTIPASTI -->
        <div class="menu-page active" id="page-1">
            <header class="menu-header">
                <div class="logo-cerchio">
                    <p class="logo-sub">Cucina Mediterranea</p>
                    <h1 class="logo-titolo">da Ignazio</h1>
                </div>
            </header>
            
            <section class="menu-section">
                <h2 class="section-title">Antipasti</h2>
                <?php stampaCategoria($conn, 'antipasti'); ?>
            </section>
            <div class="page-number">Pagina 1 di 5</div>
        </div>

        <!-- PAGINA 2: PRIMI -->
        <div class="menu-page" id="page-2">
            <section class="menu-section">
                <h2 class="section-title">Primi Piatti</h2>
                <?php stampaCategoria($conn, 'primi'); ?>
            </section>
            <div class="page-number">Pagina 2 di 5</div>
        </div>

        <!-- PAGINA 3: SECONDI -->
        <div class="menu-page" id="page-3">
            <section class="menu-section">
                <h2 class="section-title">Secondi Piatti</h2>
                <?php stampaCategoria($conn, 'secondi'); ?>
            </section>
            <div class="page-number">Pagina 3 di 5</div>
        </div>

        <!-- PAGINA 4: VINI -->
        <div class="menu-page" id="page-4">
            <section class="menu-section">
                <h2 class="section-title">I Nostri Vini</h2>
                <?php stampaCategoria($conn, 'vini'); ?>
            </section>
            <div class="page-number">Pagina 4 di 5</div>
        </div>

        <!-- PAGINA 5: DOLCI & BEVANDE -->
        <div class="menu-page" id="page-5">
            <section class="menu-section">
                <h2 class="section-title">Dolci & Bevande</h2>
                <?php 
                // Passiamo un array così la funzione cerca sia i dolci che le bevande insieme
                stampaCategoria($conn, ['dolci', 'bevande']); 
                ?>
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