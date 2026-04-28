package com.anteiku.backend.notification.payload;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GroupChatPayload(
    @JsonProperty("user_id")
    String userId,

    @JsonProperty("sender_id")
    String senderId,

    @JsonProperty("group_id")
    String groupId,

    @JsonProperty("group_name")
    String groupName,

    String content,

    long timestamp
) implements NotificationPayload {}