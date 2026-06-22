-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Giu 18, 2026 alle 16:04
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ristorante_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `dettaglio_ordine`
--

CREATE TABLE `dettaglio_ordine` (
  `id_ordine` int(11) NOT NULL,
  `id_piatto` int(11) NOT NULL,
  `quantita` int(11) NOT NULL DEFAULT 1,
  `prezzo_uni` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `feedback`
--

CREATE TABLE `feedback` (
  `id_recensione` int(11) NOT NULL,
  `voto` int(11) NOT NULL CHECK (`voto` between 1 and 5),
  `commento` text DEFAULT NULL,
  `data_invio` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_tavolo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `menu`
--

CREATE TABLE `menu` (
  `id_piatto` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `descrizione` text DEFAULT NULL,
  `prezzo` decimal(6,2) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `disponibile` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `ordini`
--

CREATE TABLE `ordini` (
  `id_ordine` int(11) NOT NULL,
  `stato_ordine` varchar(75) DEFAULT 'In attesa',
  `totale` decimal(7,2) DEFAULT 0.00,
  `id_prenotazione` int(11) DEFAULT NULL,
  `creato_il` datetime NOT NULL DEFAULT current_timestamp(),
  `pagato_il` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazioni`
--

CREATE TABLE `prenotazioni` (
  `id_prenotazione` int(11) NOT NULL,
  `nome_cliente` varchar(100) NOT NULL,
  `data_ora` datetime NOT NULL,
  `numero_persone` int(11) NOT NULL,
  `id_tavolo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tavoli`
--

CREATE TABLE `tavoli` (
  `id_tavolo` int(11) NOT NULL,
  `numero_tavolo` int(11) NOT NULL,
  `capacita_posti` int(11) NOT NULL,
  `disponibilità` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `dettaglio_ordine`
--
ALTER TABLE `dettaglio_ordine`
  ADD PRIMARY KEY (`id_ordine`,`id_piatto`),
  ADD KEY `id_piatto` (`id_piatto`);

--
-- Indici per le tabelle `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id_recensione`),
  ADD KEY `id_tavolo` (`id_tavolo`);

--
-- Indici per le tabelle `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_piatto`);

--
-- Indici per le tabelle `ordini`
--
ALTER TABLE `ordini`
  ADD PRIMARY KEY (`id_ordine`),
  ADD KEY `id_prenotazione` (`id_prenotazione`);

--
-- Indici per le tabelle `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD PRIMARY KEY (`id_prenotazione`),
  ADD KEY `id_tavolo` (`id_tavolo`);

--
-- Indici per le tabelle `tavoli`
--
ALTER TABLE `tavoli`
  ADD PRIMARY KEY (`id_tavolo`),
  ADD UNIQUE KEY `numero_tavolo` (`numero_tavolo`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id_recensione` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `menu`
--
ALTER TABLE `menu`
  MODIFY `id_piatto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `ordini`
--
ALTER TABLE `ordini`
  MODIFY `id_ordine` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  MODIFY `id_prenotazione` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `tavoli`
--
ALTER TABLE `tavoli`
  MODIFY `id_tavolo` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `dettaglio_ordine`
--
ALTER TABLE `dettaglio_ordine`
  ADD CONSTRAINT `dettaglio_ordine_ibfk_1` FOREIGN KEY (`id_ordine`) REFERENCES `ordini` (`id_ordine`) ON DELETE CASCADE,
  ADD CONSTRAINT `dettaglio_ordine_ibfk_2` FOREIGN KEY (`id_piatto`) REFERENCES `menu` (`id_piatto`) ON DELETE CASCADE;

--
-- Limiti per la tabella `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`id_tavolo`) REFERENCES `tavoli` (`id_tavolo`) ON DELETE CASCADE;

--
-- Limiti per la tabella `ordini`
--
ALTER TABLE `ordini`
  ADD CONSTRAINT `ordini_ibfk_1` FOREIGN KEY (`id_prenotazione`) REFERENCES `prenotazioni` (`id_prenotazione`) ON DELETE CASCADE;

--
-- Limiti per la tabella `prenotazioni`
--
ALTER TABLE `prenotazioni`
  ADD CONSTRAINT `prenotazioni_ibfk_1` FOREIGN KEY (`id_tavolo`) REFERENCES `tavoli` (`id_tavolo`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
