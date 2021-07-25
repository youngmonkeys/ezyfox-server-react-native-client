package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.logger.EzyLogger;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyLogMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) throws Exception {
        String level = (String)params.getString("level");
        String message = (String)params.getString("message");
        if(level == null)
            level = "i";
        if(level.equals("w")) {
            EzyLogger.warn(message);
        }
        else if(level.equals("e")) {
            EzyLogger.error(message);
        }
        else if(level.equals("d")) {
            EzyLogger.debug(message);
        }
        else {
            EzyLogger.info(message);
        }
        return Boolean.TRUE;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_LOG;
    }
}
