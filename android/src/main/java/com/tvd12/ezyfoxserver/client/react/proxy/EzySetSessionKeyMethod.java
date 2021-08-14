package com.tvd12.ezyfoxserver.client.react.proxy;

import android.util.Base64;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.react.EzyMethodNames;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzySetSessionKeyMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) {
        EzyClient client = getClient(params);
        String sessionKey = params.getString("sessionKey");
        client.setSessionKey(Base64.decode(sessionKey, Base64.NO_WRAP));
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_SET_SESSION_KEY;
    }
}
