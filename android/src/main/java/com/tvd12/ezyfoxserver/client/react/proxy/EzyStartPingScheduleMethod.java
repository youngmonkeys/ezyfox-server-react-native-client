package com.tvd12.ezyfoxserver.client.react.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.react.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.socket.EzyPingSchedule;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyStartPingScheduleMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) {
        EzyClient client = getClient(params);
        EzyPingSchedule pingSchedule = client.getPingSchedule();
        pingSchedule.start();
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_START_PING_SCHEDULE;
    }
}
