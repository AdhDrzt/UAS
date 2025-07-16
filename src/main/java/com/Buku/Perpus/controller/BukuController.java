package com.Buku.Perpus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Buku.Perpus.model.Buku;
import com.Buku.Perpus.service.BukuService;

@RestController
@RequestMapping("/api/v1")
public class BukuController {

    @Autowired
    private BukuService bukuService;

    @GetMapping("/buku")
    public List<Buku> getAllBuku() {
        return bukuService.getAllBuku();
    }

    @GetMapping("/buku/{id}")
    public Buku getBukuById(@PathVariable Long id) {
        return bukuService.getBukuById(id).orElseThrow(() -> new RuntimeException("Buku not found with id " + id));
    }

    @PostMapping("/buku")
    public Buku createBuku(@RequestBody Buku buku) {
        return bukuService.createBuku(buku);
    }

    @PutMapping("/buku/{id}")
    public Buku updateBuku(@PathVariable Long id, @RequestBody Buku bukuDetails) {
        return bukuService.updateBuku(id, bukuDetails);
    }

    @DeleteMapping("/buku/{id}")
    public void deleteBuku(@PathVariable Long id) {
        bukuService.deleteBuku(id);
    }
}
