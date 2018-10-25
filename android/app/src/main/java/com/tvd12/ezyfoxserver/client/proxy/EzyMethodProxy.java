package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyClients;

/**
 * Created by tavandung12 on 10/24/18.
 */

public abstract class EzyMethodProxy {

    protected ReadableMap params;
    protected EzyClients clients = EzyClients.getInstance();

    public abstract void validate();
    public abstract Object invoke();
    public abstract String getName();

    protected EzyClient getClient(String name) {
        EzyClient client = clients.getClient(name);
        return client;
    }

    public void setParams(ReadableMap params) {
        this.params = params;
    }

    protected EzyClient getClient() {
        if(!params.hasKey("clientName"))
            throw new IllegalArgumentException("must specific client name");
        String clientName = params.getString("clientName");
        EzyClient client = getClient(clientName);
        return client;
    }
}
