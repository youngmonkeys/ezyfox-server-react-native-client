package vn.team.freechat_react_native;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.tvd12.ezyfoxserver.client.EzyClientPackage;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by tavandung12 on 10/24/18.
 */

public class MainApplication extends Application implements ReactApplication {

    private ReactNativeHost host = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            Log.w("hello-world", "hello-world");
            List<ReactPackage> packages = new ArrayList<>();
            packages.add(new MainReactPackage(),
            new RNGestureHandlerPackage());
            packages.add(new EzyClientPackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return host;
    }
}
