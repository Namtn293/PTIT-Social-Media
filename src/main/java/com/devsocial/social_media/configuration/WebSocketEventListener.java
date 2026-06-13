package com.devsocial.social_media.configuration;

import com.devsocial.social_media.core.auth.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    // Track sessionId -> userName
    private static final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        java.security.Principal principal = event.getUser();
        log.info("SessionConnectEvent triggered. SessionId: {}, Principal: {}", sessionId, principal);
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
            if (auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                sessionUserMap.put(sessionId, user.getUsername());
                log.info("User connected (SessionConnectEvent): {} (Session: {})", user.getUsername(), sessionId);
                broadcastActiveUsers();
            }
        }
    }

    @EventListener
    public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        java.security.Principal principal = event.getUser();
        log.info("SessionConnectedEvent triggered. SessionId: {}, Principal: {}", sessionId, principal);
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
            if (auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                sessionUserMap.put(sessionId, user.getUsername());
                log.info("User connected (SessionConnectedEvent): {} (Session: {})", user.getUsername(), sessionId);
                broadcastActiveUsers();
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        log.info("SessionDisconnectEvent triggered. SessionId: {}", sessionId);
        if (sessionId != null) {
            String userName = sessionUserMap.remove(sessionId);
            if (userName != null) {
                log.info("User disconnected: {} (Session: {})", userName, sessionId);
                broadcastActiveUsers();
            } else {
                java.security.Principal principal = event.getUser();
                if (principal instanceof UsernamePasswordAuthenticationToken) {
                    UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) principal;
                    if (auth.getPrincipal() instanceof User) {
                        User user = (User) auth.getPrincipal();
                        log.info("User disconnected fallback: {}", user.getUsername());
                    }
                }
            }
        }
    }

    public Set<String> getActiveUsernames() {
        return new HashSet<>(sessionUserMap.values());
    }

    private void broadcastActiveUsers() {
        messagingTemplate.convertAndSend("/topic/online-users", getActiveUsernames());
    }
}
