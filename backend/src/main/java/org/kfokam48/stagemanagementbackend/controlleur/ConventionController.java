package org.kfokam48.stagemanagementbackend.controlleur;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionRequestDTO;
import org.kfokam48.stagemanagementbackend.dto.convention.ConventionResponseDTO;
import org.kfokam48.stagemanagementbackend.service.ConventionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/conventions") // URL de base du contrôleur
public class ConventionController {

    private final ConventionService conventionService;

    public ConventionController(ConventionService conventionService) {
        this.conventionService = conventionService;
    }

    // ✅ Récupérer une convention par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> findByConventionId(@PathVariable Long id) {
        ConventionResponseDTO convention = conventionService.findByConventionId(id);
        return ResponseEntity.ok(convention);
    }

    // ✅ Ajouter une nouvelle convention avec upload du PDF
    @PostMapping(value = "/ajouter", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN')")
    public ResponseEntity<ConventionResponseDTO> createConvention(
            @RequestParam("candidature-id") Long idCandidature,
            @RequestParam("pdf") MultipartFile file) throws Exception {
        ConventionRequestDTO conventionRequestDTO = new ConventionRequestDTO();
        conventionRequestDTO.setIdCandidature(idCandidature);
        ConventionResponseDTO convention = conventionService.createConvention(conventionRequestDTO, file);
        return ResponseEntity.ok(convention);
    }

    // ✅ Mettre à jour une convention avec un nouveau fichier PDF
    @PutMapping(value = "/{id}/modifier", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> updateConvention(
            @PathVariable Long id,
            @RequestParam("candidature-id") Long CandidatureId,
            @RequestParam("pdf") MultipartFile file) throws Exception {
        ConventionRequestDTO conventionRequestDTO = new ConventionRequestDTO();
        conventionRequestDTO.setIdCandidature(id);
        ConventionResponseDTO convention = conventionService.updateConvention(conventionRequestDTO, id, file);
        return ResponseEntity.ok(convention);
    }

    // ✅ Supprimer une convention
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteConvention(@PathVariable Long id) {
        String message = conventionService.deleteConvention(id);
        return ResponseEntity.ok(message);
    }

    // ✅ Récupérer toutes les conventions
    @GetMapping
    @PreAuthorize("hasRole('ENTREPRISE') or hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<ConventionResponseDTO>> findAllConventions() {
        List<ConventionResponseDTO> conventions = conventionService.findAllConventions();
        return ResponseEntity.ok(conventions);
    }

    // ✅ Valider une convention par un enseignant
    @PutMapping("/{id}/valider-enseignant/{enseignantId}")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<ConventionResponseDTO> validateConventionByEnseignant(
            @PathVariable Long id, @PathVariable Long enseignantId) throws Exception {

        ConventionResponseDTO convention = conventionService.validateConventionByEnseignant(enseignantId, id);
        return ResponseEntity.ok(convention);
    }

    // ✅ Approuver une convention par un administrateur
    @PutMapping("/{id}/approuver-administrateur/{adminId}")
    @PreAuthorize(" hasRole('ADMIN')")
    public ResponseEntity<ConventionResponseDTO> approuveConventionByAdministrator(
            @PathVariable Long id, @PathVariable Long adminId) throws Exception {

        ConventionResponseDTO convention = conventionService.approuveConventionByAdministrator(adminId, id);
        return ResponseEntity.ok(convention);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadConvention(@PathVariable Long id) throws Exception {
        return conventionService.downloadConvention(id);
    }

}