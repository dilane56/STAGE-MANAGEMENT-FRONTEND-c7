package org.kfokam48.stagemanagementbackend.repository;

import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.model.Secteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {

    // Filtrer les offres par localisation, durée et secteur
    @Query("SELECT o FROM OffreStage o WHERE " +
            "(:localisation IS NULL OR LOWER(o.localisation) LIKE CONCAT('%', :localisation, '%')) AND " +
            "(:dureeStage IS NULL OR o.dureeStage = :dureeStage) AND " +
            "(:secteurNom IS NULL OR LOWER(o.secteur.nomSecteur) LIKE CONCAT('%', :secteurNom, '%'))")
    List<OffreStage> filtrer(
            @Param("localisation") String localisation,
            @Param("dureeStage") Integer dureeStage,
            @Param("secteurNom") String secteurNom
    );
    List<OffreStage> findOffreStageBySecteur(Secteur secteur);
    List<OffreStage> findByEntrepriseId(Long entrepriseId);
    Long countByEntrepriseId(Long entrepriseId);
}
