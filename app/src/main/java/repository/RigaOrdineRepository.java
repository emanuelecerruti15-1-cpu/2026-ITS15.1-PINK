package repository;


import model.RigaOrdine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface RigaOrdineRepository extends JpaRepository<RigaOrdine, Long>{
    List<RigaOrdine> findByOrdineId(Long ordineId);
}
