/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.restaurantmanager;

/**
 *
 * @author Emanuele
 */
public class Menu {
    private String Piatto;
    private int tipo;
    private double prezzo;
    public Menu(String Piatto,int tipo, double prezzo){
        setMenu(Piatto, tipo, prezzo);
    } 
    public void setMenu(String Piatto,int tipo,  double prezzo){
        this.Piatto = Piatto;
        this.tipo = tipo;
        this.prezzo = prezzo;
    }
    public String getPiatto(){
        return Piatto;
    }
    public int getTipo(int tipo){
        return tipo;        
    }
    public double getPrezzo(){
        return prezzo;
    }
    
}
