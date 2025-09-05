package org.kfokam48.stagemanagementbackend.dto.enseigant;

import lombok.Data;
import org.kfokam48.stagemanagementbackend.dto.utilisateur.UtilisateurDTO;

@Data
public class EnseignantDTO extends UtilisateurDTO {
    private String specialite;
    private String grade;
    private String departement;
    private String universite;
}
