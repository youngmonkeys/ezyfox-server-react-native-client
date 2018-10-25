package com.tvd12.ezyfoxserver.client.serializer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.config.EzyClientConfig;
import com.tvd12.ezyfoxserver.client.config.EzyReconnectConfig;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyClientConfigSerializer {

    public ReadableMap serialize(EzyClientConfig config) {
        WritableMap map = Arguments.createMap();
        map.putString("clientName", config.getClientName());
        map.putString("zoneName", config.getZoneName());
        WritableMap reconnectMap = Arguments.createMap();
        EzyReconnectConfig reconnectConfig = config.getReconnect();
        reconnectMap.putInt("maxReconnectCount", reconnectConfig.getMaxReconnectCount());
        reconnectMap.putInt("reconnectPeriod", reconnectConfig.getReconnectPeriod());
        reconnectMap.putBoolean("enable", reconnectConfig.isEnable());
        map.putMap("reconnect", reconnectMap);
        return map;
    }

}
