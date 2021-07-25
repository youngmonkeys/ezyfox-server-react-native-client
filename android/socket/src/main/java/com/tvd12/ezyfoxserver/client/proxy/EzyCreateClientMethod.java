package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tvd12.ezyfoxserver.client.EzyClient;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.setup.EzySetup;
import com.tvd12.ezyfoxserver.client.config.EzyClientConfig;
import com.tvd12.ezyfoxserver.client.config.EzyReconnectConfig;
import com.tvd12.ezyfoxserver.client.constant.EzyCommand;
import com.tvd12.ezyfoxserver.client.constant.EzyConstant;
import com.tvd12.ezyfoxserver.client.entity.EzyArray;
import com.tvd12.ezyfoxserver.client.event.EzyEvent;
import com.tvd12.ezyfoxserver.client.event.EzyEventType;
import com.tvd12.ezyfoxserver.client.handler.EzyDataHandler;
import com.tvd12.ezyfoxserver.client.handler.EzyEventHandler;
import com.tvd12.ezyfoxserver.client.serializer.EzyNativeSerializers;

/**
 * Created by tavandung12 on 10/24/18.
 */

public class EzyCreateClientMethod extends EzyMethodProxy {

    private final ReactContext reactContext;

    public EzyCreateClientMethod(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void validate(ReadableMap params) {
        if(params == null)
            throw new NullPointerException("the config is null, can't create an client");
        if(!params.hasKey("zoneName"))
            throw new IllegalArgumentException("must specific zone name");
    }

    @Override
    public Object invoke(ReadableMap params) {
        EzyClientConfig config = newConfig(params);
        EzyClient client = getClient(config.getClientName());
        if(client == null) {
            client = clients.newClient(config);
            setupClient(client);
        }
        ReadableMap configMap = EzyNativeSerializers.serialize(config);
        return configMap;
    }

    private EzyClientConfig newConfig(ReadableMap params) {
        EzyClientConfig.Builder configBuilder = EzyClientConfig.builder();
        if(params.hasKey("clientName"))
            configBuilder.clientName(params.getString("clientName"));
        if(params.hasKey("zoneName"))
            configBuilder.zoneName(params.getString("zoneName"));
        if(params.hasKey("reconnect")) {
            ReadableMap reconnect = params.getMap("reconnect");
            EzyReconnectConfig.Builder reconnectConfigBuilder = configBuilder.reconnectConfigBuilder();
            if (reconnect.hasKey("enable"))
                reconnectConfigBuilder.enable(reconnect.getBoolean("enable"));
            if (reconnect.hasKey("reconnectPeriod"))
                reconnectConfigBuilder.reconnectPeriod(reconnect.getInt("reconnectPeriod"));
            if (reconnect.hasKey("maxReconnectCount"))
                reconnectConfigBuilder.maxReconnectCount(reconnect.getInt("maxReconnectCount"));
        }
        EzyClientConfig config = configBuilder.build();
        return config;
    }

    public void setupClient(EzyClient client) {
        EzySetup setup = client.setup();
        for(EzyEventType eventType : EzyEventType.values())
            setup.addEventHandler(eventType, new EzyNativeEventHandler(client, reactContext));
        for(EzyCommand command : EzyCommand.values())
            setup.addDataHandler(command, new EzyNativeDataHandler(client, reactContext, command));
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_INIT;
    }
}

class EzyNativeEventHandler implements EzyEventHandler<EzyEvent> {
    private final EzyClient client;
    private final ReactContext reactContext;

    public EzyNativeEventHandler(EzyClient client, ReactContext reactContext) {
        this.client = client;
        this.reactContext = reactContext;
    }

    @Override
    public void handle(EzyEvent event) {
        String eventTypeName = event.getType().getName();
        WritableMap params = Arguments.createMap();
        WritableMap eventData = EzyNativeSerializers.serialize(event);
        params.putString("clientName", client.getName());
        params.putString("eventType", eventTypeName);
        params.putMap("data", eventData);
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("ezy.event", params);
    }
}

class EzyNativeDataHandler implements EzyDataHandler {
    private final EzyClient client;
    private final ReactContext reactContext;
    private final EzyConstant command;

    public EzyNativeDataHandler(EzyClient client,
                                ReactContext reactContext,
                                EzyConstant command) {
        this.client = client;
        this.reactContext = reactContext;
        this.command = command;
    }

    @Override
    public void handle(EzyArray data) {
        String commandName = command.getName();
        WritableMap params = Arguments.createMap();
        WritableArray commandData = EzyNativeSerializers.toWritableArray(data);
        params.putString("clientName", client.getName());
        params.putString("command", commandName);
        params.putArray("data", commandData);
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("ezy.data", params);
    }
}