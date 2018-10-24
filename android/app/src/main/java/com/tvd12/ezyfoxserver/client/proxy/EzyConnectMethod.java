package com.tvd12.ezyfoxserver.client.proxy;

import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;

/**
 * Created by tavandung12 on 10/24/18.
 */

public class EzyConnectMethod extends EzyMethodProxy {

    @Override
    protected void validate() {
        if(!params.hasKey("clientName"))
            throw new IllegalArgumentException("unknown client");
        if(!params.hasKey("host"))
            throw new IllegalArgumentException("must specific host");
        if(!params.hasKey("port"))
            throw new IllegalArgumentException("must specific port");
    }

    @Override
    protected Object invoke() {
        String host = params.getString("host");
        int port = params.getInt("port");
        String clientName = params.getString("clientName");
        EzyClient client = clients.getClient(clientName);
        client.connect(host, port);
        return client;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_CONNECT;
    }
}
