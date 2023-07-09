package com.tvd12.ezyfoxserver.client.react.proxy;

import android.util.Base64;

import com.facebook.react.bridge.ReadableMap;
import com.tvd12.ezyfoxserver.client.react.EzyMethodNames;
import com.tvd12.ezyfoxserver.client.security.EzyAsyCrypt;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyRsaDecryptMethod extends EzyMethodProxy {
    @Override
    public Object invoke(ReadableMap params) throws Exception {
        String message = params.getString("message");
        String privateKey = params.getString("privateKey");
        byte[] decryption = EzyAsyCrypt.builder()
                .privateKey(Base64.decode(privateKey, Base64.NO_WRAP))
                .build()
                .decrypt(Base64.decode(message, Base64.NO_WRAP));
        return Base64.encodeToString(decryption, Base64.NO_WRAP);
    }

    @Override
    public String getName() {
        return EzyMethodNames.METHOD_RSA_DECRYPT;
    }
}
