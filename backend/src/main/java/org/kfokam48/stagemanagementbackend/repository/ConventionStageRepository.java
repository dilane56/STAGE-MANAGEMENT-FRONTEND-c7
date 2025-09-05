package org.kfokam48.stagemanagementbackend.repository;

import org.kfokam48.stagemanagementbackend.enums.StatutConvention;
import org.kfokam48.stagemanagementbackend.model.ConventionStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConventionStageRepository extends JpaRepository<ConventionStage, Long> {
    Long countByEnseignantValideurId(Long enseignantId);
    Long countByEnseignantValideurIdAndStatutConvention(Long enseignantId, StatutConvention statut);
    Long countByStatutConvention(StatutConvention statut);
    
    @Query("SELECT COUNT(DISTINCT c.candidature.etudiant.id) FROM ConventionStage c WHERE c.enseignantValideur.id = :enseignantId")
    Long countDistinctStudentsByEnseignantId(Long enseignantId);
}
