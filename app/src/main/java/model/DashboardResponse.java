package model;


import java.util.ArrayList;
import java.util.List;


public class DashboardResponse{
    private double incassoOggi;
    private int tavoliOccupati;
    private int tavoliTotali;
    private int percentualeOccupazione;
    private int ordiniAttivi;
    private int ordiniInCucina;
    private int prenotazioniOggi;


    private List<DashboardOrdine> ordiniAttiviLista = new ArrayList<>();
    private List<DashboardPrenotazione> prossimePrenotazioni = new ArrayList<>();


    public double getIncassoOggi(){
        return incassoOggi;
    }


    public void setIncassoOggi(double incassoOggi){
        this.incassoOggi = incassoOggi;
    }


    public int getTavoliOccupati(){
        return tavoliOccupati;
    }


    public void setTavoliOccupati(int tavoliOccupati){
        this.tavoliOccupati = tavoliOccupati;
    }


    public int getTavoliTotali(){
        return tavoliTotali;
    }


    public void setTavoliTotali(int tavoliTotali){
        this.tavoliTotali = tavoliTotali;
    }


    public int getPercentualeOccupazione(){
        return percentualeOccupazione;
    }


    public void setPercentualeOccupazione(int percentualeOccupazione){
        this.percentualeOccupazione = percentualeOccupazione;
    }


    public int getOrdiniAttivi(){
        return ordiniAttivi;
    }


    public void setOrdiniAttivi(int ordiniAttivi){
        this.ordiniAttivi = ordiniAttivi;
    }


    public int getOrdiniInCucina(){
        return ordiniInCucina;
    }


    public void setOrdiniInCucina(int ordiniInCucina){
        this.ordiniInCucina = ordiniInCucina;
    }


    public int getPrenotazioniOggi(){
        return prenotazioniOggi;
    }


    public void setPrenotazioniOggi(int prenotazioniOggi){
        this.prenotazioniOggi = prenotazioniOggi;
    }


    public List<DashboardOrdine> getOrdiniAttiviLista(){
        return ordiniAttiviLista;
    }


    public void setOrdiniAttiviLista(List<DashboardOrdine> ordiniAttiviLista){
        this.ordiniAttiviLista = ordiniAttiviLista;
    }


    public List<DashboardPrenotazione> getProssimePrenotazioni(){
        return prossimePrenotazioni;
    }


    public void setProssimePrenotazioni(List<DashboardPrenotazione> prossimePrenotazioni){
        this.prossimePrenotazioni = prossimePrenotazioni;
    }


    public static class DashboardOrdine{
        private Long id;
        private int tavoloNumero;
        private String piatti;
        private double totale;
        private String stato;


        public DashboardOrdine(){
        }


        public DashboardOrdine(Long id, int tavoloNumero, String piatti, double totale, String stato){
            this.id = id;
            this.tavoloNumero = tavoloNumero;
            this.piatti = piatti;
            this.totale = totale;
            this.stato = stato;
        }


        public Long getId(){
            return id;
        }


        public void setId(Long id){
            this.id = id;
        }


        public int getTavoloNumero(){
            return tavoloNumero;
        }


        public void setTavoloNumero(int tavoloNumero){
            this.tavoloNumero = tavoloNumero;
        }


        public String getPiatti(){
            return piatti;
        }


        public void setPiatti(String piatti){
            this.piatti = piatti;
        }


        public double getTotale(){
            return totale;
        }


        public void setTotale(double totale){
            this.totale = totale;
        }


        public String getStato(){
            return stato;
        }


        public void setStato(String stato){
            this.stato = stato;
        }

    }



    public static class DashboardPrenotazione{
        private Long id;
        private String nome;
        private String ora;
        private String data;
        private int tavoloNumero;
        private int persone;


        public DashboardPrenotazione(){
        }


        public DashboardPrenotazione(Long id, String nome, String ora, String data, int tavoloNumero, int persone){
            this.id = id;
            this.nome = nome;
            this.ora = ora;
            this.data = data;
            this.tavoloNumero = tavoloNumero;
            this.persone = persone;
        }


        public Long getId(){
            return id;
        }


        public void setId(Long id){
            this.id = id;
        }


        public String getNome(){
            return nome;
        }


        public void setNome(String nome){
            this.nome = nome;
        }


        public String getOra(){
            return ora;
        }


        public void setOra(String ora){
            this.ora = ora;
        }


        public String getData(){
            return data;
        }


        public void setData(String data){
            this.data = data;
        }


        public int getTavoloNumero(){
            return tavoloNumero;
        }


        public void setTavoloNumero(int tavoloNumero){
            this.tavoloNumero = tavoloNumero;
        }


        public int getPersone(){
            return persone;
        }


        public void setPersone(int persone){
            this.persone = persone;
        }

    }

}

