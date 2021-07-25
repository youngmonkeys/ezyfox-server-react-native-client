package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
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
        answer.putString("publicKey", new String(publicKey));
        answer.putString("privateKey", new String(privateKey));
        return answer;
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_GENERATE_KEY_PAIR;
    }
}
