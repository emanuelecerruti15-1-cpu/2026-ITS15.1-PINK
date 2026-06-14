/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.restaurantmanager;

/**
 *
 * @author Emanuele
 */
public class Prenotazioni extends Tavoli{
    private String nome;
    private int posti;
    public Prenotazioni(String nome, int posti){
        super(posti);
        setNome(nome);
    }
    private void setNome(String nome){
        this.nome = nome;
    }
    public String getNome(){
        return nome;
    }
    
}
