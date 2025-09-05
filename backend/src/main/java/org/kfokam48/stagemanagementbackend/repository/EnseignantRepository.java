package org.kfokam48.stagemanagementbackend.repository;

import jakarta.persistence.Id;
import org.kfokam48.stagemanagementbackend.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    // Custom query methods can be defined here if needed
    // For example, findByNom(String nom);
}
