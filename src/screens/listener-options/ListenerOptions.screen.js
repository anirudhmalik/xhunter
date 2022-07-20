import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Linking } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    HStack,
    Spacer,
    Badge,
    Link,
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
import CustomServerConnectingScreen from "../../components/CustomServerConnectingScreen";
import XhunterServerConnectingScreen from "../../components/XhunterServerConnectingScreen";

const ListenerOptions = ({navigation}) => {
  const [visible, setVisible]= useState(false);
  const [visible2, setVisible2]= useState(false);
  const [visible3, setVisible3]= useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const { subdomain, isListening } = useSelector((state) => state.userInfo);
  useEffect(()=>{
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
    setVisible2(false);
    setVisible3(false);
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
    {!isListening&&<>
    <Button onPress={()=>setVisible3(true)} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening (heroku server)'}
    </Button>
    <Button onPress={handleStartLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening (localtunnel server)'}
    </Button>
    <Button onPress={()=>setVisible2(true)} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening (custom server)'}
    </Button>
    </>}

    {isListening&&<Button onPress={handleStopLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Stop Listening'}
    </Button>}
  
    </Box>
    <ConnectingScreen visible={visible} title={"Please wait, Forwarding port.."}/>
    <CustomServerConnectingScreen visible={visible2} setVisible={setVisible2}/>
    <XhunterServerConnectingScreen visible={visible3} setVisible={setVisible3}/>
    </>
    )
};

export default ListenerOptions;

  