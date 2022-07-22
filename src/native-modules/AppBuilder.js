import { NativeModules } from 'react-native';
const  { AppBuilder } = NativeModules;
      
module.exports = {
    readDB: async function ( dbpath, query, response ) {
        await AppBuilder.readDB(dbpath, query)
        .then(data => response( data))
        .catch(err => response(err) );
    },
    sshTunnel: async function ( c, response ) {
        await AppBuilder.sshTunnel(c.user, c.host, c.pass, c.rport, c.lhost, c.lport)
                .then(data => response( "s",data.message))
                .catch(err => response( "e",err.message) );
    },
    sshTunnelDisconnect: async function ( response ) {
        await AppBuilder.sshTunnelDisconnect()
                .then(data => response( "s",data.message))
                .catch(err => response( "e",err.message) );
    },
    bindApp: function ( path, ip, injectPermission) {
        AppBuilder.bindApp(path, ip, injectPermission)
    },
    bindWhatsapp: function ( ip) {
        AppBuilder.bindWhatsapp(ip)
   },

}