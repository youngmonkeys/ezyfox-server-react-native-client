package com.tvd12.ezyfoxserver.client.proxy;

import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.constant.EzyConnectionStatus;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzySetStatusMethod extends EzyMethodProxy {
    @Override
    public void validate() {
    }

    @Override
    public Object invoke() {
        EzyClient client = getClient();
        String statusName = params.getString("status");
        client.setStatus(EzyConnectionStatus.valueOf(statusName));
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_SET_STATUS;
    }
}
