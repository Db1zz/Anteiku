package com.anteiku.backend.notification.service;

import com.anteiku.backend.exception.UserIsNotAuthorized;
import com.anteiku.backend.model.UserInfoDto;
import com.anteiku.backend.notification.event.EventType;
import com.anteiku.backend.notification.event.EventScope;
import com.anteiku.backend.notification.event.NotificationEvent;
import com.anteiku.backend.notification.kafka.producer.NotificationProducer;
import com.anteiku.backend.notification.payload.DmPayload;
import com.anteiku.backend.security.jwt.JwtService;
import com.anteiku.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import javax.naming.AuthenticationException;

@Service
@AllArgsConstructor
public class NotificationService {
    private final NotificationProducer notificationProducer;
    private final ObjectMapper objectMapper;
    private final JwtService jwtService;
    private final UserService userService;

    public String generateNotificationToken() throws UserIsNotAuthorized {
        UserInfoDto userInfoDto = userService.getMe();;
        return jwtService.generateToken(userInfoDto.getEmail(), userInfoDto.getId());
    }

    public void sendToDm(DmPayload dmPayload) {
        NotificationEvent notificationEvent = new NotificationEvent(
            EventType.MESSAGE_CREATED,
                EventScope.DM,
                dmPayload
        );
        String json = objectMapper.writeValueAsString(notificationEvent);
        notificationProducer.send(json);
    }
}
