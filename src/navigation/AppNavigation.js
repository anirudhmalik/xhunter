import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { PermissionsAndroid, BackHandler } from 'react-native';
import { useToast } from "native-base";
// redux
import { useDispatch, useSelector } from '../redux/store';
import { addSubdomain } from '../redux/slices/userInfo'

import Home from "../screens/home/Home.screen"
import PayloadOptions from '../screens/payload-builder/PayloadOptions.screen';
import PayloadBuilder from '../screens/payload-builder/PayloadBuilder.screen';
import Dashboard from '../screens/dashboard/Dashboard.screen';
import ClientManager from '../screens/client-manager/ClientManager.screen';
import DeviceInformation from '../screens/device-information/DeviceInformation.screen';
import SMS from "../screens/sms/SMS.screen"
import DeviceFileManager from '../screens/device-file-manager/DeviceFileManager.screen';
import WhatsappMessages from '../screens/whatsapp-messages/WhatsappMessages.screen';
import Chat from '../screens/chat/Chat.screen';
import WhatsappContacts from '../screens/whatsapp-contacts/WhatsappContacts.screen';
import Loot from '../screens/loot/Loot.screen';
import WhatsappLoot from '../screens/loot/WhatsappLoot.screen';
import ChatLoot from '../screens/loot/ChatLoot.screen';

const Stack = createStackNavigator(); 

const AppNavigation = () => {
   const dispatch = useDispatch();
   const toast = useToast();
   const { subdomain } = useSelector((state) => state.userInfo);

   useEffect(()=>{
     !subdomain&&dispatch(addSubdomain(randomString(10)));
     requestPermission();
   },[])

   async function requestPermission() 
   {
     const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (!granted) {
     try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted!== PermissionsAndroid.RESULTS.GRANTED) {
               toast.show({ title: "Permission not granted", status: "error",placement: "top",description: "App will close, Please allow the permission"})
               setTimeout(()=>{ BackHandler.exitApp()},4000)
          } 
        } catch (err) { }
        } 
   }
   function randomString(length) {
     var chars = 'abcdefghiklmnopqrstuvwxyz'.split('');
 
     if (! length) {
         length = Math.floor(Math.random() * chars.length);
     }
 
     var str = '';
     for (var i = 0; i < length; i++) {
         str += chars[Math.floor(Math.random() * chars.length)];
     }
     return str;
 }
 
   return(
   <Stack.Navigator initialRouteName={'home'} screenOptions={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>   
        <Stack.Screen
             name="home"
             component={Home}
        />
        <Stack.Screen
             name="payloadOptions"
             component={PayloadOptions}
        />
        <Stack.Screen
             name="payloadBuilder"
             component={PayloadBuilder}
        />
        <Stack.Screen
             name="dashboard"
             component={Dashboard}
        />
         <Stack.Screen
             name="clientManager"
             component={ClientManager}
        />
         <Stack.Screen
             name="deviceInformation"
             component={DeviceInformation}
        />
        <Stack.Screen
             name="deviceFileManager"
             component={DeviceFileManager}
        />
        <Stack.Screen
             name="sms"
             component={SMS}
        />
         <Stack.Screen
             name="whatsappMessages"
             component={WhatsappMessages}
        />
        <Stack.Screen
             name="chat"
             component={Chat}
        />
        <Stack.Screen
             name="whatsappContacts"
             component={WhatsappContacts}
        />
        <Stack.Screen
             name="loot"
             component={Loot}
        />
         <Stack.Screen
             name="whatsappLoot"
             component={WhatsappLoot}
        />
         <Stack.Screen
             name="chatLoot"
             component={ChatLoot}
        />

   </Stack.Navigator>
  )
};

export default AppNavigation;