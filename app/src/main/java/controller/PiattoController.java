package controller;

import java.util.List;
import model.Piatto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.PiattoService;

@RestController
@RequestMapping("/api/piatti")
@CrossOrigin(origins = "*")
public class PiattoController {

    private final PiattoService piattoService;

    public PiattoController(PiattoService piattoService) {
        this.piattoService = piattoService;
    }

    @GetMapping
    public List<Piatto> getTuttiIPiatti() {
        return piattoService.getTuttiIPiatti();
    }

    @GetMapping("/{id}")
    public Piatto getPiattoById(@PathVariable("id") Long id) {
        return piattoService.getPiattoById(id);
    }

    @PostMapping
    public Piatto creaPiatto(@RequestBody Piatto piatto) {
        return piattoService.creaPiatto(
                piatto.getNome(),
                piatto.getPrezzo(),
                piatto.isDisponibile()
        );
    }

    @PutMapping("/{id}")
    public Piatto modificaPiatto(@PathVariable("id") Long id, @RequestBody Piatto piatto) {
        return piattoService.modificaPiatto(
                id,
                piatto.getNome(),
                piatto.getPrezzo(),
                piatto.isDisponibile()
        );
    }

    @DeleteMapping("/{id}")
    public void eliminaPiatto(@PathVariable("id") Long id) {
        piattoService.eliminaPiatto(id);
    }
}
