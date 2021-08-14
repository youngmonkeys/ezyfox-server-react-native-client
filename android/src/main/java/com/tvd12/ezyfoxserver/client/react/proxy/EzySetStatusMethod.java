package com.tvd12.ezyfoxserver.client.react.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.react.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.constant.EzyConnectionStatus;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzySetStatusMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) {
        EzyClient client = getClient(params);
        String statusName = params.getString("status");
        client.setStatus(EzyConnectionStatus.valueOf(statusName));
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_SET_STATUS;
    }
}
