package org.kfokam48.stagemanagementbackend.chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Component
public class ChatMessageHandler extends TextWebSocketHandler {

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session); // ✅ Stocke chaque session
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        for (WebSocketSession wsSession : sessions.values()) {
            wsSession.sendMessage(message); // ✅ Diffuse le message à tous les utilisateurs connectés
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId()); // ✅ Supprime la session quand l'utilisateur se déconnecte
    }
}
