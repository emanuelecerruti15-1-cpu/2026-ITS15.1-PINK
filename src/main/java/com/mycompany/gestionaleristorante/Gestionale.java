/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.gestionaleristorante;


import java.net.URL;
import java.awt.BorderLayout;
import javax.swing.JPanel;
import javax.swing.JFrame;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.web.WebView;

public class Gestionale extends JFrame {

    private JPanel pannelloContenitore;

    public Gestionale() {
        initComponents();
        inizializzaBrowserLocale();
    }

    private void inizializzaBrowserLocale() {
        final JFXPanel fxPanel = new JFXPanel();
        
        // Creiamo il layout
        pannelloContenitore = new JPanel(new BorderLayout());
        pannelloContenitore.add(fxPanel, BorderLayout.CENTER);
        
        this.getContentPane().setLayout(new BorderLayout());
        this.getContentPane().add(pannelloContenitore, BorderLayout.CENTER);

        Platform.runLater(() -> {
            WebView webView = new WebView();
            // Cerca l'index nel pacchetto resources che abbiamo creato
            URL url = getClass().getResource("/resources/index.html");
            
            if (url != null) {
                webView.getEngine().load(url.toExternalForm());
            } else {
                webView.getEngine().loadContent("<html><body><h2 style='color:red;'>Errore: index.html non trovato!</h2></body></html>");
            }

            Scene scene = new Scene(webView);
            fxPanel.setScene(scene);
        });
    }

    private void initComponents() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1024, 768);
        setLocationRelativeTo(null);
    }

    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(() -> {
            new Gestionale().setVisible(true);
        });
    }
}
