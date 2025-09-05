package org.kfokam48.stagemanagementbackend.repository;

import jakarta.persistence.Id;
import org.kfokam48.stagemanagementbackend.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    // Custom query methods can be defined here if needed
    // For example, findByNom(String nom);
}
