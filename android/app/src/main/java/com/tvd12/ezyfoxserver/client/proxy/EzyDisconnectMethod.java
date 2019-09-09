package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;

public class EzyDisconnectMethod extends EzyMethodProxy {

    @Override
    public Object invoke(ReadableMap params) {
        EzyClient client = getClient(params);
        int reason = 0;
        if(params.hasKey("reason"))
            reason = params.getInt("reason");
        client.disconnect(reason);
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_DISCONNECT;
    }
}
