package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.constant.EzyCommand;
import com.tvd12.ezyfoxserver.client.entity.EzyArray;
import com.tvd12.ezyfoxserver.client.serializer.EzyNativeSerializers;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzySendMethod extends EzyMethodProxy {
    @Override
    public void validate(ReadableMap params) {
        if(!params.hasKey("request"))
            throw new IllegalArgumentException("must specific request to send to server");
    }

    @Override
    public Object invoke(ReadableMap params) {
        EzyClient client = getClient(params);
        ReadableMap request = params.getMap("request");
        String cmd = request.getString("command");
        ReadableArray data = request.getArray("data");
        EzyArray array = EzyNativeSerializers.fromReadableArray(data);
        client.send(EzyCommand.valueOf(cmd), array);
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_SEND;
    }
}
