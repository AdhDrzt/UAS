package com.Buku.Perpus.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Buku.Perpus.model.Buku;
import com.Buku.Perpus.repository.BukuRepository;

@Service
public class BukuService {

    @Autowired
    private BukuRepository bukuRepository;

    public List<Buku> getAllBuku() {
        return bukuRepository.findAll();
    }

    public Optional<Buku> getBukuById(Long id) {
        return bukuRepository.findById(id);
    }

    public Buku createBuku(Buku buku) {
        return bukuRepository.save(buku);
    }

    public Buku updateBuku(Long id, Buku bukuDetails) {
        Buku buku = bukuRepository.findById(id).orElseThrow(() -> new RuntimeException("Buku not found with id " + id));
        buku.setJudul(bukuDetails.getJudul());
        buku.setPenulis(bukuDetails.getPenulis());
        buku.setTahunTerbit(bukuDetails.getTahunTerbit());
        buku.setKategori(bukuDetails.getKategori());
        return bukuRepository.save(buku);
    }

    public void deleteBuku(Long id) {
        bukuRepository.deleteById(id);
    }
}
