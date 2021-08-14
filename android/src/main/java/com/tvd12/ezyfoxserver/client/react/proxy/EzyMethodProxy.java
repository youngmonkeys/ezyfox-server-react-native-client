package com.tvd12.ezyfoxserver.client.react.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyClients;

/**
 * Created by tavandung12 on 10/24/18.
 */

public abstract class EzyMethodProxy {

    protected EzyClients clients = EzyClients.getInstance();

    public abstract Object invoke(ReadableMap params) throws Exception;
    public abstract String getName();

    public void validate(ReadableMap params) {}

    protected EzyClient getClient(String name) {
        EzyClient client = clients.getClient(name);
        return client;
    }

    protected EzyClient getClient(ReadableMap params) {
        if(!params.hasKey("clientName"))
            throw new IllegalArgumentException("must specific client name");
        String clientName = params.getString("clientName");
        EzyClient client = getClient(clientName);
        return client;
    }
}
