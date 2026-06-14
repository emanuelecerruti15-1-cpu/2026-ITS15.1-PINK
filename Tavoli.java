/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.restaurantmanager;

/**
 *
 * @author Emanuele
 */
public class Tavoli {
    private final int posti;
    private static int i = 0;
    private final int numTavolo;
    public Tavoli(int x){
        posti = x;
        numTavolo= i;
        i++;
    }
    public int getPosti(){
        return posti;
    }
    public int getTavolo(){
        return numTavolo;
    }
}
