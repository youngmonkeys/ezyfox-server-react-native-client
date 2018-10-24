package com.tvd12.ezyfoxserver.client;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.proxy.EzyConnectMethod;
import com.tvd12.ezyfoxserver.client.proxy.EzyCreateClientMethod;
import com.tvd12.ezyfoxserver.client.proxy.EzyMethodProxy;

import java.util.HashMap;
import java.util.Map;

public class EzyClientModule extends ReactContextBaseJavaModule {

    private final Map<String, EzyMethodProxy> methods;

    public EzyClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.methods = new HashMap<>();
        this.init();
    }

    private void init() {
        addMethod(new EzyCreateClientMethod());
        addMethod(new EzyConnectMethod());
    }

    private void addMethod(EzyMethodProxy method) {
        methods.put(method.getName(), method);
    }

    @ReactMethod
    public void call(String method, ReadableMap params, Callback success, Callback failure) {
        EzyMethodProxy func = methods.get(method);
        if(func == null)
            throw new IllegalArgumentException("has no method: " + method);
        try {
            func.setParams(params);
            Object result = func.invoke();
            success.invoke(result);
        }
        catch (EzyMethodCallException e) {
            failure.invoke(e.getCode(), e.getMessage());
        }
        catch (Exception e) {
            Log.e("ezyfox-client", "fatal error when call method: " + method, e);
        }
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @Override
    public String getName() {
        return "EzyClient";
    }
}