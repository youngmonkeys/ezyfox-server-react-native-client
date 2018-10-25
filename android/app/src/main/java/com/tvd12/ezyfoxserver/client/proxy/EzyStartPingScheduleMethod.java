package com.tvd12.ezyfoxserver.client.proxy;

import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.socket.EzyPingSchedule;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyStartPingScheduleMethod extends EzyMethodProxy {
    @Override
    public void validate() {
    }

    @Override
    public Object invoke() {
        EzyClient client = getClient();
        EzyPingSchedule pingSchedule = client.getPingSchedule();
        pingSchedule.start();
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_START_PING_SCHEDULE;
    }
}
