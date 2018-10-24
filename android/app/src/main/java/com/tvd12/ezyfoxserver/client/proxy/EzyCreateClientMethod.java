package com.tvd12.ezyfoxserver.client.proxy;

import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.EzyTcpClient;
import com.tvd12.ezyfoxserver.client.config.EzyClientConfig;
import com.tvd12.ezyfoxserver.client.config.EzyReconnectConfig;

/**
 * Created by tavandung12 on 10/24/18.
 */

public class EzyCreateClientMethod extends  EzyMethodProxy {
    @Override
    protected void validate() {
        if(params == null)
            throw new NullPointerException("the config is null, can't create an client");
        if(!params.hasKey("zoneName"))
            throw new IllegalArgumentException("must specific zone name");
    }

    @Override
    protected Object invoke() {
        EzyClientConfig.Builder configBuilder = EzyClientConfig.builder();
        if(params.hasKey("clientName"))
            configBuilder.clientName(params.getString("clientName"));
        if(params.hasKey("zoneName"))
            configBuilder.zoneName(params.getString("zoneName"));
        EzyReconnectConfig.Builder reconnectConfigBuilder = configBuilder.reconnectConfigBuilder();
        if(params.hasKey("enable"))
            reconnectConfigBuilder.enable(params.getBoolean("enable"));
        if(params.hasKey("reconnectPeriod"))
            reconnectConfigBuilder.reconnectPeriod(params.getInt("reconnectPeriod"));
        if(params.hasKey("maxReconnectCount"))
            reconnectConfigBuilder.maxReconnectCount(params.getInt("maxReconnectCount"));
        EzyClientConfig config = configBuilder.build();
        EzyClient client = getClient(config.getClientName());
        if(client == null)
            client = new EzyTcpClient(config);
        clients.addClient(client);
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_INIT;
    }
}
