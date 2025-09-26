# Endpoints à ajouter dans le backend

## 1. DTOs à créer

### MonthlyStatsDTO.java
```java
package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class MonthlyStatsDTO {
    private String month;
    private Long internships;
    private Long applications;
}
```

### SectorStatsDTO.java
```java
package org.kfokam48.stagemanagementbackend.dto.stats;

import lombok.Data;

@Data
public class SectorStatsDTO {
    private String name;
    private Long value;
    private String color;
}
```

## 2. Méthodes à ajouter dans StatsService.java

```java
List<MonthlyStatsDTO> getMonthlyEvolution();
List<SectorStatsDTO> getInternshipsBySector();
```

## 3. Implémentation dans StatsServiceImpl.java

```java
@Override
public List<MonthlyStatsDTO> getMonthlyEvolution() {
    List<MonthlyStatsDTO> monthlyStats = new ArrayList<>();
    
    // Récupérer les données des 6 derniers mois
    LocalDate now = LocalDate.now();
    for (int i = 5; i >= 0; i--) {
        LocalDate monthDate = now.minusMonths(i);
        String monthName = monthDate.format(DateTimeFormatter.ofPattern("MMM", Locale.FRENCH));
        
        LocalDateTime startOfMonth = monthDate.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = monthDate.withDayOfMonth(monthDate.lengthOfMonth()).atTime(23, 59, 59);
        
        Long internshipsCount = offreStageRepository.countByDatePublicationBetween(startOfMonth, endOfMonth);
        Long applicationsCount = candidatureRepository.countByDateCandidatureBetween(startOfMonth, endOfMonth);
        
        MonthlyStatsDTO monthStats = new MonthlyStatsDTO();
        monthStats.setMonth(monthName);
        monthStats.setInternships(internshipsCount);
        monthStats.setApplications(applicationsCount);
        
        monthlyStats.add(monthStats);
    }
    
    return monthlyStats;
}

@Override
public List<SectorStatsDTO> getInternshipsBySector() {
    List<Object[]> results = offreStageRepository.countInternshipsBySector();
    List<SectorStatsDTO> sectorStats = new ArrayList<>();
    
    String[] colors = {"#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"};
    int colorIndex = 0;
    
    for (Object[] result : results) {
        SectorStatsDTO sectorStat = new SectorStatsDTO();
        sectorStat.setName((String) result[0]);
        sectorStat.setValue((Long) result[1]);
        sectorStat.setColor(colors[colorIndex % colors.length]);
        colorIndex++;
        
        sectorStats.add(sectorStat);
    }
    
    return sectorStats;
}
```

## 4. Méthodes à ajouter dans OffreStageRepository.java

```java
Long countByDatePublicationBetween(LocalDateTime start, LocalDateTime end);

@Query("SELECT s.nomSecteur, COUNT(o) FROM OffreStage o JOIN o.secteur s GROUP BY s.nomSecteur ORDER BY COUNT(o) DESC")
List<Object[]> countInternshipsBySector();
```

## 5. Méthodes à ajouter dans CandidatureRepository.java

```java
Long countByDateCandidatureBetween(LocalDateTime start, LocalDateTime end);
```

## 6. Endpoints à ajouter dans StatsController.java

```java
@GetMapping("/monthly-evolution")
public ResponseEntity<Map<String, Object>> getMonthlyEvolution() {
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("data", statsService.getMonthlyEvolution());
    return ResponseEntity.ok(response);
}

@GetMapping("/internships-by-sector")
public ResponseEntity<Map<String, Object>> getInternshipsBySector() {
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("data", statsService.getInternshipsBySector());
    return ResponseEntity.ok(response);
}
```