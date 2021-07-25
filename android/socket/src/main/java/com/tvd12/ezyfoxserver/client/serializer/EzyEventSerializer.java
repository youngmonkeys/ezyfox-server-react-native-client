package com.tvd12.ezyfoxserver.client.serializer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.constant.EzyDisconnectReasons;
import com.tvd12.ezyfoxserver.client.event.EzyConnectionFailureEvent;
import com.tvd12.ezyfoxserver.client.event.EzyDisconnectionEvent;
import com.tvd12.ezyfoxserver.client.event.EzyEvent;
import com.tvd12.ezyfoxserver.client.event.EzyEventType;
import com.tvd12.ezyfoxserver.client.event.EzyLostPingEvent;
import com.tvd12.ezyfoxserver.client.event.EzyTryConnectEvent;
import com.tvd12.ezyfoxserver.client.function.EzyFunction;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyEventSerializer {

    private final Map<EzyEventType, EzyFunction<EzyEvent, WritableMap>> appliers;

    public EzyEventSerializer() {
        this.appliers = newAppliers();
    }

    public WritableMap serialize(EzyEvent event) {
        EzyEventType eventType = event.getType();
        EzyFunction<EzyEvent, WritableMap> func = getApplier(eventType);
        WritableMap answer = func.apply(event);
        return answer;
    }

    private EzyFunction<EzyEvent, WritableMap> getApplier(EzyEventType eventType) {
        if(appliers.containsKey(eventType))
            return appliers.get(eventType);
        throw new IllegalArgumentException("has no serializer for event type: " + eventType);
    }

    private Map<EzyEventType, EzyFunction<EzyEvent, WritableMap>> newAppliers() {
        Map<EzyEventType, EzyFunction<EzyEvent, WritableMap>> answer = new HashMap<>();
        answer.put(EzyEventType.CONNECTION_SUCCESS, new EzyFunction<EzyEvent, WritableMap>() {
            @Override
            public WritableMap apply(EzyEvent event) {
                return Arguments.createMap();
            }
        });
        answer.put(EzyEventType.CONNECTION_FAILURE, new EzyFunction<EzyEvent, WritableMap>() {
            @Override
            public WritableMap apply(EzyEvent event) {
                EzyConnectionFailureEvent mevent = (EzyConnectionFailureEvent)event;
                WritableMap map = Arguments.createMap();
                map.putString("reason", mevent.getReason().toString());
                return map;
            }
        });
        answer.put(EzyEventType.DISCONNECTION, new EzyFunction<EzyEvent, WritableMap>() {
            @Override
            public WritableMap apply(EzyEvent event) {
                EzyDisconnectionEvent mevent = (EzyDisconnectionEvent)event;
                WritableMap map = Arguments.createMap();
                int reason = mevent.getReason();
                String reasonName = EzyDisconnectReasons.getDisconnectReasonName(reason);
                map.putString("reason", reasonName);
                return map;
            }
        });
        answer.put(EzyEventType.LOST_PING, new EzyFunction<EzyEvent, WritableMap>() {
            @Override
            public WritableMap apply(EzyEvent event) {
                EzyLostPingEvent mevent = (EzyLostPingEvent)event;
                WritableMap map = Arguments.createMap();
                map.putInt("count", mevent.getCount());
                return map;
            }
        });
        answer.put(EzyEventType.TRY_CONNECT, new EzyFunction<EzyEvent, WritableMap>() {
            @Override
            public WritableMap apply(EzyEvent event) {
                EzyTryConnectEvent mevent = (EzyTryConnectEvent)event;
                WritableMap map = Arguments.createMap();
                map.putInt("count", mevent.getCount());
                return map;
            }
        });
        return answer;
    }

}
