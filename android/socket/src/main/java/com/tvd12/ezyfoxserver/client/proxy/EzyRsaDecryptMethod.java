package com.tvd12.ezyfoxserver.client.proxy;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.sercurity.EzyAsyCrypt;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyRsaDecryptMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) throws Exception {
        String message = params.getString("message");
        String privateKey = params.getString("privateKey");
        byte[] decryption = EzyAsyCrypt.builder()
                .privateKey(privateKey.getBytes())
                .build()
                .decrypt(message.getBytes());
        return new String(decryption);
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_RSA_DECRYPT;
    }
}
