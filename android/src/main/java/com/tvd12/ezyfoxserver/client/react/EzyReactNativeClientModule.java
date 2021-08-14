package com.tvd12.ezyfoxserver.client.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = EzyReactNativeClientModule.NAME)
public class EzyReactNativeClientModule extends EzyClientProxy {
    public static final String NAME = "EzyClientProxy";

    public EzyReactNativeClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }
}
