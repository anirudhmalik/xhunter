import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
// redux
import { useDispatch } from '../redux/store';
import { addSubdomain } from '../redux/slices/userInfo'

import Home from "../screens/home/Home.screen"
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
   useEffect(()=>{
      dispatch(addSubdomain('xhunter')) // add device id unique
   },[])
   return(
   <Stack.Navigator initialRouteName={'home'} screenOptions={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>   
        <Stack.Screen
             name="home"
             component={Home}
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