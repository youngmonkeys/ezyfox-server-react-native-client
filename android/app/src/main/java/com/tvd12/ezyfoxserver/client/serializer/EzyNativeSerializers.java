package com.tvd12.ezyfoxserver.client.serializer;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.config.EzyClientConfig;
import com.tvd12.ezyfoxserver.client.entity.EzyArray;
import com.tvd12.ezyfoxserver.client.event.EzyEvent;

/**
 * Created by tavandung12 on 10/25/18.
 */

public final class EzyNativeSerializers {

    private static final EzyEventSerializer EVENT_SERIALIZER = new EzyEventSerializer();
    private static final EzyNativeDataSerializer DATA_SERIALIZER = new EzyNativeDataSerializer();
    private static final EzyNativeDataDeserializer DATA_DESERIALIZER = new EzyNativeDataDeserializer();
    private static final EzyClientConfigSerializer CLIENT_CONFIG_SERIALIZER = new EzyClientConfigSerializer();

    private EzyNativeSerializers() {
    }

    public static WritableMap serialize(EzyEvent event) {
        WritableMap answer = EVENT_SERIALIZER.serialize(event);
        return answer;
    }

    public static WritableArray toWritableArray(EzyArray array) {
        WritableArray answer = DATA_SERIALIZER.toWritableArray(array);
        return answer;
    }

    public static EzyArray fromReadableArray(ReadableArray array) {
        EzyArray answer = DATA_DESERIALIZER.fromReadableArray(array);
        return answer;
    }

    public static ReadableMap serialize(EzyClientConfig config) {
        ReadableMap answer = CLIENT_CONFIG_SERIALIZER.serialize(config);
        return answer;
    }

}
