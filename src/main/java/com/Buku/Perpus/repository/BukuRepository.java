package com.Buku.Perpus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Buku.Perpus.model.Buku;

@Repository
public interface BukuRepository extends JpaRepository<Buku, Long> {
}
