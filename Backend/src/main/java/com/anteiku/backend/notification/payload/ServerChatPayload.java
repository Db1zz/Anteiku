package com.anteiku.backend.notification.payload;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ServerChatPayload(
    @JsonProperty("user_id")
    String userId,

    @JsonProperty("sender_id")
    String senderId,

    @JsonProperty("chat_id")
    String chatId,

    @JsonProperty("server_id")
    String serverId,

    String content,

    long timestamp
) implements NotificationPayload {}
