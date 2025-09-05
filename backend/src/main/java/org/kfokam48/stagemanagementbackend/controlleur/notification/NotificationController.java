package org.kfokam48.stagemanagementbackend.controlleur.notification;

import lombok.RequiredArgsConstructor;

import org.kfokam48.stagemanagementbackend.dto.notification.NotificationResponseDTO;
import org.kfokam48.stagemanagementbackend.model.Notification;
import org.kfokam48.stagemanagementbackend.service.notification.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;


    public void sendNotification(Long recepteurId, String title, String message, boolean sendMail) {
        Notification notif = notificationService.createnotifcation(recepteurId, title, message, sendMail);
        NotificationResponseDTO responseDTO = notificationService.convertToNotificationResponseDTO(notif);

        // envoi temps réel via STOMP
        messagingTemplate.convertAndSendToUser(
                recepteurId.toString(),
                "/notifications",
                responseDTO
        );
    }
}
