package org.kfokam48.stagemanagementbackend.notification;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CandidatureNotificationHandler extends TextWebSocketHandler {

    private static final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Enregistre la session avec l'ID utilisateur
        Long userId = getUserIdFromSession(session); // Récupérer l'ID utilisateur
        if (userId != null) {
            sessions.put(userId, session);
        }
    }

    public void sendNotification(Long userId, String message) throws IOException {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }

    private Long getUserIdFromSession(WebSocketSession session) {
        // Récupérer l'ID utilisateur à partir de la session (ex: JWT, paramètre)
        return (Long) session.getAttributes().get("userId");
    }
}

