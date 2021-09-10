package com.tvd12.ezyfoxserver.client.react.serializer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.config.EzyClientConfig;
import com.tvd12.ezyfoxserver.client.config.EzyPingConfig;
import com.tvd12.ezyfoxserver.client.config.EzyReconnectConfig;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyClientConfigSerializer {

    public ReadableMap serialize(EzyClientConfig config) {
        WritableMap map = Arguments.createMap();
        map.putString("clientName", config.getClientName());
        map.putString("zoneName", config.getZoneName());

        EzyPingConfig pingConfig = config.getPing();
        WritableMap pingMap = Arguments.createMap();
        pingMap.putInt("maxLostPingCount", pingConfig.getMaxLostPingCount());
        pingMap.putInt("pingPeriod", (int)pingConfig.getPingPeriod());
        map.putMap("ping", pingMap);

        EzyReconnectConfig reconnectConfig = config.getReconnect();
        WritableMap reconnectMap = Arguments.createMap();
        reconnectMap.putInt("maxReconnectCount", reconnectConfig.getMaxReconnectCount());
        reconnectMap.putInt("reconnectPeriod", reconnectConfig.getReconnectPeriod());
        reconnectMap.putBoolean("enable", reconnectConfig.isEnable());
        map.putMap("reconnect", reconnectMap);

        return map;
    }

}
