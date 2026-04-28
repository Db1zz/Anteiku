package com.anteiku.backend.notification.payload;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DmPayload(
    @JsonProperty("user_id")
    String userId,

    @JsonProperty("sender_id")
    String senderId,

    @JsonProperty("chat_id")
    String chatId,

    String content,

    long timestamp
) implements NotificationPayload {}