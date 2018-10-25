package com.tvd12.ezyfoxserver.client.serializer;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.tvd12.ezyfoxserver.client.builder.EzyArrayBuilder;
import com.tvd12.ezyfoxserver.client.builder.EzyObjectBuilder;
import com.tvd12.ezyfoxserver.client.entity.EzyArray;
import com.tvd12.ezyfoxserver.client.entity.EzyObject;
import com.tvd12.ezyfoxserver.client.factory.EzyEntityFactory;
import com.tvd12.ezyfoxserver.client.function.EzyFunction;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by tavandung12 on 10/25/18.
 */

public class EzyNativeDataDeserializer {

    private final Map<ReadableType, EzyFunction<Dynamic, Object>> appliers;

    public EzyNativeDataDeserializer() {
        this.appliers = newAppliers();
    }

    public EzyArray fromReadableArray(ReadableArray value) {
        EzyArrayBuilder arrayBuilder = EzyEntityFactory.newArrayBuilder();
        if(value != null) {
            for (int i = 0; i < value.size(); i++) {
                Dynamic tmp = value.getDynamic(i);
                Object item = deserialize(tmp);
                arrayBuilder.append(item);
            }
        }
        EzyArray array = arrayBuilder.build();
        return array;
    }

    private Object deserialize(Dynamic value) {
        if(value == null)
            return null;
        EzyFunction<Dynamic, Object> applier = getApplier(value.getType());
        Object answer = applier.apply(value);
        return answer;
    }

    private EzyFunction<Dynamic, Object> getApplier(ReadableType readableType) {
        if(appliers.containsKey(readableType))
            return appliers.get(readableType);
        throw new IllegalArgumentException("has deserializer with readable type: " + readableType);
    }

    private Map<ReadableType, EzyFunction<Dynamic, Object>> newAppliers() {
        Map<ReadableType, EzyFunction<Dynamic, Object>> map = new HashMap<>();
        map.put(ReadableType.Null, new EzyFunction<Dynamic, Object>() {
            @Override
            public Object apply(Dynamic dynamic) {
                return null;
            }
        });
        map.put(ReadableType.Boolean, new EzyFunction<Dynamic, Object>() {

            @Override
            public Object apply(Dynamic dynamic) {
                return dynamic.asBoolean();
            }
        });
        map.put(ReadableType.Number, new EzyFunction<Dynamic, Object>() {
            @Override
            public Object apply(Dynamic dynamic) {
                Integer intValue = dynamic.asInt();
                Double doubleValue = dynamic.asDouble();
                if(intValue.equals(doubleValue.intValue()))
                    return intValue;
                return doubleValue;
            }
        });
        map.put(ReadableType.String, new EzyFunction<Dynamic, Object>() {
            @Override
            public Object apply(Dynamic dynamic) {
                return dynamic.asString();
            }
        });
        map.put(ReadableType.Array, new EzyFunction<Dynamic, Object>() {

            @Override
            public Object apply(Dynamic dynamic) {
                EzyArrayBuilder arrayBuilder = EzyEntityFactory.newArrayBuilder();
                ReadableArray readableArray = dynamic.asArray();
                for(int i = 0 ; i < readableArray.size() ; i++) {
                    Dynamic tmp = readableArray.getDynamic(i);
                    Object value = deserialize(tmp);
                    arrayBuilder.append(value);
                }
                EzyArray array = arrayBuilder.build();
                return array;
            }
        });
        map.put(ReadableType.Map, new EzyFunction<Dynamic, Object>() {
            @Override
            public Object apply(Dynamic dynamic) {
                EzyObjectBuilder objectBuilder = EzyEntityFactory.newObjectBuilder();
                ReadableMap readableMap = dynamic.asMap();
                ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
                while (iterator.hasNextKey()) {
                    String key = iterator.nextKey();
                    Dynamic temp = readableMap.getDynamic(key);
                    Object value = deserialize(temp);
                    objectBuilder.append(key, value);
                }
                EzyObject object = objectBuilder.build();
                return object;
            }
        });
        return map;
    }

}
