package com.tvd12.client;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.tvd12.ezyfoxserver.client.EzyClientProxy;

@ReactModule(name = EzyReactNativeClientModule.NAME)
public class EzyReactNativeClientModule extends EzyClientProxy {
    public static final String NAME = "ezyfox-server-react-native-client";

    public EzyReactNativeClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }
}
