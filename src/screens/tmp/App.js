import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, TextInput } from 'react-native';
import httpBridge  from 'react-native-app-server';
import TcpSocket from 'react-native-tcp-socket';
import nodejs from 'nodejs-mobile-react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      log:'',
      cmd:'',
      uniqueId:'xhunter',
      isListening:false,
      devices:{}
    };
  }

  componentDidMount() {
   nodejs.channel.addListener("log",(log) => this.setState({log}), this);
   nodejs.channel.addListener("listnerStarted", this._onlistnerStart, this);
   nodejs.channel.addListener("deviceJoined", this._handleAddDevice, this);
   nodejs.channel.addListener("deviceDisconnected", this._handleRemoveDevice, this);
   nodejs.channel.addListener("cmd", (msg) => alert("From node: " + msg), this);
  }
  
   _handleStart=()=>{
    nodejs.channel.post('startListener',this.state.uniqueId)
   }
   _onlistnerStart=()=>{
     this.setState({isListening:true})
   }

   _handleAddDevice=(data)=>{
    let device = JSON.parse(data);
    this.state.devices[device.id]=device;
   }

   _handleRemoveDevice=(id)=>{
    delete this.state.devices[id];
   }

   _handleStop=()=>{
    nodejs.channel.post('stopListener')
    this.setState({isListening:false})
   }
   _handleSend=(id,msg)=>{
    const data = {
      to: id,
      action: msg
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
   }
   
  render() {
    return (
     <View style={styles.background}>
       {Object.keys(this.state.devices).map((key,index)=> <Text key={index}>{this.state.devices[key].model}</Text>)}
       <Text>{this.state.log}</Text>
       <Button onPress={this._handleStart} disabled={this.state.isListening} title="start listening"/>
       <Button onPress={this._handleStop} title="stop listening"/>
       <TextInput
       placeholder='cmd'
       value={this.state.cmd}
       onChangeText={(cmd)=>this.setState({cmd})}
       />
        <Button onPress={()=>this._handleSend(this.state.devices[Object.keys(this.state.devices)[0]].id,this.state.cmd)} title="send message"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})

//add redux native-base navigation