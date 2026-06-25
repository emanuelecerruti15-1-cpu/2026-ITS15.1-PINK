/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 * Enum che rappresenta la forma grafica del tavolo.
 *
 * Serve al frontend per sapere come disegnare il tavolo
 * nella piantina della sala.
 */
public enum FormaTavolo {

    /**
     * Tavolo rotondo.
     */
    CERCHIO,

    /**
     * Tavolo quadrato.
     */
    QUADRATO,

    /**
     * Tavolo rettangolare orizzontale.
     */
    RETTANGOLARE,

    /**
     * Tavolo rettangolare verticale.
     */
    RETTANGOLARE_V
}