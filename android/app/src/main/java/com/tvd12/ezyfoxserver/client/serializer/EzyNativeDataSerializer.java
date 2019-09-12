package com.tvd12.ezyfoxserver.client.serializer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.tvd12.ezyfoxserver.client.entity.EzyArray;
import com.tvd12.ezyfoxserver.client.entity.EzyArrayList;
import com.tvd12.ezyfoxserver.client.entity.EzyHashMap;
import com.tvd12.ezyfoxserver.client.entity.EzyObject;
import com.tvd12.ezyfoxserver.client.function.EzyBiConsumer;
import com.tvd12.ezyfoxserver.client.function.EzyTriConsumer;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyNativeDataSerializer {

    private final Map<Class, EzyBiConsumer<WritableArray, Object>> arrayAppliers;
    private final Map<Class, EzyTriConsumer<WritableMap, Object, Object>> mapAppliers;

    public EzyNativeDataSerializer() {
        this.arrayAppliers = newArrayAppliers();
        this.mapAppliers = newMapAppliers();
    }

    public WritableArray toWritableArray(EzyArray value) {
        WritableArray answer = Arguments.createArray();
        if(value != null) {
            for (int i = 0; i < value.size(); ++i) {
                Object item = value.get(i);
                serialize(answer, item);
            }
        }
        return answer;
    }

    public WritableMap toWritableMap(EzyObject value) {
        WritableMap answer = Arguments.createMap();
        if(value != null) {
            for (Object key : value.keySet()) {
                Object val = value.get(key);
                serialize(answer, key, val);
            }
        }
        return answer;
    }

    public void serialize(WritableArray output, Object value) {
        if(value == null) {
            output.pushNull();
        }
        else {
            EzyBiConsumer<WritableArray, Object> applier = getArrayApplier(value.getClass());
            applier.accept(output, value);
        }
    }

    public void serialize(WritableMap output, Object key, Object value) {
        if(value == null)
            return;
        EzyTriConsumer<WritableMap, Object, Object> valueApplier = getMapApplier(value.getClass());
        valueApplier.accept(output, key, value);
    }

    private EzyBiConsumer<WritableArray, Object> getArrayApplier(Class type) {
        if(arrayAppliers.containsKey(type))
            return arrayAppliers.get(type);
        throw new IllegalArgumentException("has no serializer for: " + type);
    }

    private EzyTriConsumer<WritableMap, Object, Object> getMapApplier(Class type) {
        if(mapAppliers.containsKey(type))
            return mapAppliers.get(type);
        throw new IllegalArgumentException("has no serializer for: " + type);
    }

    private Map<Class, EzyBiConsumer<WritableArray, Object>> newArrayAppliers() {
        Map<Class, EzyBiConsumer<WritableArray, Object>> answer = new HashMap<>();
        answer.put(Boolean.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushBoolean((Boolean)o);
            }
        });
        answer.put(Byte.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushInt((Byte)o);
            }
        });
        answer.put(Character.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushInt((Character)o);
            }
        });
        answer.put(Double.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushDouble((Double)o);
            }
        });
        answer.put(Float.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushDouble((Float)o);
            }
        });
        answer.put(Integer.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushInt((Integer)o);
            }
        });
        answer.put(Long.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushInt(((Long)o).intValue());
            }
        });
        answer.put(Short.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushInt((Short)o);
            }
        });
        answer.put(String.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                writableArray.pushString((String)o);
            }
        });
        answer.put(EzyArrayList.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                WritableArray array = toWritableArray((EzyArray) o);
                writableArray.pushArray(array);
            }
        });
        answer.put(EzyHashMap.class, new EzyBiConsumer<WritableArray, Object>() {
            @Override
            public void accept(WritableArray writableArray, Object o) {
                WritableMap map = toWritableMap((EzyObject) o);
                writableArray.pushMap(map);
            }
        });
        return answer;
    }

    private Map<Class, EzyTriConsumer<WritableMap, Object, Object>> newMapAppliers() {
        Map<Class, EzyTriConsumer<WritableMap, Object, Object>> answer = new HashMap<>();
        answer.put(Boolean.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putBoolean(key.toString(), (Boolean)value);
            }
        });
        answer.put(Byte.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putInt(key.toString(), (Byte)value);
            }
        });
        answer.put(Character.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putInt(key.toString(), (Character)value);
            }
        });
        answer.put(Double.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putDouble(key.toString(), (Double)value);
            }
        });
        answer.put(Float.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putDouble(key.toString(), (Float)value);
            }
        });
        answer.put(Integer.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putInt(key.toString(), (Integer)value);
            }
        });
        answer.put(Long.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putInt(key.toString(), ((Long)value).intValue());
            }
        });
        answer.put(Short.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putInt(key.toString(), (Short)value);
            }
        });
        answer.put(String.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                writableMap.putString(key.toString(), (String)value);
            }
        });
        answer.put(EzyArrayList.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                WritableArray array = toWritableArray((EzyArray)value);
                writableMap.putArray(key.toString(), array);
            }
        });
        answer.put(EzyHashMap.class, new EzyTriConsumer<WritableMap, Object, Object>() {
            @Override
            public void accept(WritableMap writableMap, Object key, Object value) {
                WritableMap map = toWritableMap((EzyObject) value);
                writableMap.putMap(key.toString(), map);
            }
        });
        return answer;
    }

}
