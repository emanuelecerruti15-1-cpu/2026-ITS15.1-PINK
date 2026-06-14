/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.restaurantmanager;

/**
 *
 * @author Emanuele
 */
import java.util.ArrayList;
public class RestaurantManager {
    ArrayList<Tavoli> tavolo;
    ArrayList<Menu> menu;
    public void addTavoli(int num){
        Tavoli tavoloNum = new Tavoli(num);
        tavolo.add(tavoloNum);
    }
    public void addMenu(String piatto,int tipo, double prezzo){
        Menu menuNum = new Menu(piatto, tipo, prezzo);
        menu.add(menuNum);
    }
    public void rimuoviTavolo(int num){
        tavolo.remove(num);
    }
    public void rimuoviMenu(int num){
        menu.remove(num);
    }
    public static void main(String[] args) {
        
    }
}
