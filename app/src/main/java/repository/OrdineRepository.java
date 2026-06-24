package repository;

import model.Ordine;
import model.StatoOrdine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrdineRepository extends JpaRepository<Ordine, Long>{
    List<Ordine> findByStatoIn(List<StatoOrdine> list);

}