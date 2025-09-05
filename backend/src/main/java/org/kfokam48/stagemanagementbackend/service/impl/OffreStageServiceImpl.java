package org.kfokam48.stagemanagementbackend.service.impl;

import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageDTO;
import org.kfokam48.stagemanagementbackend.dto.offreStage.OffreStageResponseDTO;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.mapper.OffreStageMapper;
import org.kfokam48.stagemanagementbackend.model.OffreStage;
import org.kfokam48.stagemanagementbackend.repository.EntrepriseRepository;
import org.kfokam48.stagemanagementbackend.repository.OffreStageRepository;
import org.kfokam48.stagemanagementbackend.repository.SecteurRepository;
import org.kfokam48.stagemanagementbackend.service.OffreStageService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Service
@Transactional
public class OffreStageServiceImpl implements OffreStageService {
    private final OffreStageRepository offreStageRepository;
    private final OffreStageMapper offreStageMapper;
    private final EntrepriseRepository entrepriseRepository;
    private final SecteurRepository secteurRepository;

    public OffreStageServiceImpl(OffreStageRepository offreStageRepository, OffreStageMapper offreStageMapper, EntrepriseRepository entrepriseRepository, SecteurRepository secteurRepository) {
        this.offreStageRepository = offreStageRepository;
        this.offreStageMapper = offreStageMapper;
        this.entrepriseRepository = entrepriseRepository;
        this.secteurRepository = secteurRepository;
    }

    @Override
    public OffreStageResponseDTO getOffreStageById(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));

        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);
    }

    @Override
    public ResponseEntity<String> deleteOffreStageById(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        offreStageRepository.deleteById(id);
        return ResponseEntity.ok("Offre de stage deleted successfully");
    }

    @Override
    public OffreStageResponseDTO createOffreStage(OffreStageDTO offreStageDTO) {
        OffreStage offreStage = offreStageMapper.offreStageDTOToOffreStage(offreStageDTO);
        offreStage.setDatePublication(LocalDate.now());
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStageRepository.save(offreStage));
    }
    @Override
    public List<OffreStageResponseDTO> filterOffresStage(String localisation, Integer duree, String domaine) {
        List<OffreStage> offres = offreStageRepository.filtrer(localisation, duree, domaine);

        return offreStageMapper.offresStageToOffresStageResponseDTOs(offres);
    }

    @Override
    public OffreStageResponseDTO updateOffreStage(Long id, OffreStageDTO offreStageDTO) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        if (!entrepriseRepository.existsById(offreStageDTO.getEntrepriseId())) {
            throw new RessourceNotFoundException("Entreprise not found");
        }
        offreStage.setIntitule(offreStageDTO.getIntitule());
        offreStage.setDescription(offreStageDTO.getDescription());
        offreStage.setSecteur(secteurRepository.findById(offreStageDTO.getSecteurId()).orElseThrow(()-> new RessourceNotFoundException("Secteur not Found")));
        offreStage.setCompetences(offreStageDTO.getCompetences());
        offreStage.setLocalisation(offreStageDTO.getLocalisation());
        offreStage.setDureeStage(offreStageDTO.getDuree());
        offreStage.setDatePublication(LocalDate.now());
        offreStage.setDateDebutStage(offreStageDTO.getDateDebutStage());
        offreStage.setNombrePlaces(offreStageDTO.getNombrePlaces());
        offreStage.setDateLimiteCandidature(offreStageDTO.getDateLimiteCandidature());
        offreStage.setEntreprise(entrepriseRepository.findById(offreStageDTO.getEntrepriseId())
                .orElseThrow(() -> new RessourceNotFoundException("Entreprise not found")));
        offreStageRepository.save(offreStage);
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);
    }

    @Override
    public List<OffreStageResponseDTO> getAllOffresStage() {
        return offreStageMapper.offresStageToOffresStageResponseDTOs(offreStageRepository.findAll());
    }

    @Override
    public List<OffreStageResponseDTO> getOffresByEntreprise(Long entrepriseId) {
        List<OffreStage> offres = offreStageRepository.findByEntrepriseId(entrepriseId);
        return offreStageMapper.offresStageToOffresStageResponseDTOs(offres);
    }

    @Override
    public OffreStageResponseDTO addCompetence(String competence, Long id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Offre de stage not found"));
        offreStage.getCompetences().add(competence);
        offreStageRepository.save(offreStage);
        return offreStageMapper.offreStageToOffreStageResponseDTO(offreStage);

    }
}
