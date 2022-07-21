package com.xhunter;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class Logger {
    private final ReactApplicationContext reactContext;
    Logger(ReactApplicationContext context) {
        this.reactContext = context;
    }

    public void i(String message){
            WritableMap map = Arguments.createMap();
            map.putString(LOG_INFO, message);
            emit(map);
    }
    public void s(String message){
            WritableMap map = Arguments.createMap();
            map.putString(LOG_SUCCESS, message);
            emit(map);
    }
    public void w(String message){
            WritableMap map = Arguments.createMap();
            map.putString(LOG_WARNING, message);
            emit(map);
    }
    public void e(String message){
            WritableMap map = Arguments.createMap();
            map.putString(LOG_ERROR, message);
            emit(map);
    }
    public void done(String message){
        WritableMap map = Arguments.createMap();
        map.putString(LOG_DONE, message);
        emit(map);
    }
    public void ex(String message){
        WritableMap map = Arguments.createMap();
        map.putString(LOG_EX, message);
        emit(map);
    }
    public void sp(String message){
        WritableMap map = Arguments.createMap();
        map.putString(LOG_SP, message);
        emit(map);
    }
    private void emit(WritableMap map){
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(LOG_EVENT, map);
        } catch (Exception e){
            Log.e("ReactNative", "Caught Exception: " + e.getMessage());
        }
    }


    private final static String LOG_EVENT = "log";
    private final static String LOG_INFO = "i";
    private final static String LOG_SUCCESS = "s";
    private final static String LOG_WARNING = "w";
    private final static String LOG_ERROR = "e";
    private final static String LOG_DONE = "done";
    private final static String LOG_EX = "ex";
    private final static String LOG_SP = "sp";



}
