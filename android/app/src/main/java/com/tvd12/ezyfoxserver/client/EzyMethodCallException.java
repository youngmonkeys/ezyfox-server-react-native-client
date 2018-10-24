package com.tvd12.ezyfoxserver.client;

/**
 * Created by tavandung12 on 10/24/18.
 */

public class EzyMethodCallException extends RuntimeException {
    private final int code;
    private final String message;

    public EzyMethodCallException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public EzyMethodCallException(int code, String message, Throwable ex) {
        super(message, ex);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
