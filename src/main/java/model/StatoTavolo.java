/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 * Enum che rappresenta lo stato operativo di un tavolo.
 *
 * Serve per sapere se un tavolo può essere usato,
 * prenotato o occupato da un ordine.
 */
public enum StatoTavolo {

    /**
     * Tavolo libero e utilizzabile.
     */
    LIBERO,

    /**
     * Tavolo occupato da un ordine attivo.
     */
    OCCUPATO,

    /**
     * Tavolo prenotato.
     */
    PRENOTATO,

    /**
     * Tavolo non utilizzabile.
     */
    NON_DISPONIBILE;


    /**
     * Protegge il codice
     * @param valore
     * @return
     */
    public static StatoTavolo daStringa(String valore) {
        return StatoTavolo.valueOf(valore.toUpperCase());
    }
}
