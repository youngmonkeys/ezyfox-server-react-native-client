package com.tvd12.ezyfoxserver.client.react.proxy;

import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.react.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.sercurity.EzyKeysGenerator;

import java.security.KeyPair;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyGenerateKeyPairMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) {
        KeyPair keyPair = EzyKeysGenerator.builder()
                .build()
                .generate();
        byte[] publicKey = keyPair.getPublic().getEncoded();
        byte[] privateKey = keyPair.getPrivate().getEncoded();
        WritableMap answer = Arguments.createMap();
        answer.putString("publicKey", Base64.encodeToString(publicKey, Base64.NO_WRAP));
        answer.putString("privateKey", Base64.encodeToString(privateKey, Base64.NO_WRAP));
        return answer;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_GENERATE_KEY_PAIR;
    }
}
