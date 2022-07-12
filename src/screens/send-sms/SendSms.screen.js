import React,{ useState, useEffect } from "react";
import { 
    Box,
    StatusBar,
    HStack,
    Stack,
    Input,
    IconButton,
    Button,
    Icon,
    Text,
    useToast,
    TextArea
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';


// redux
import { useSelector } from '../../redux/store';

const SendSms = ({navigation, route}) => {
  const toast = useToast();  
  const { deviceId } = route.params;
  const { devices } = useSelector((state) => state.userInfo);
  const [mobile_no, setMobile]=useState();
  const [msg, setMsg]=useState();
  const [loading, setLoading]=useState(false);

  useEffect(()=>{
    nodejs.channel.addListener("sendSMS", handleResponse, this);
  },[]);

  const sendSms=()=>{
    const re =/^\d{10}$/; 
    if(!msg){
        toast.show({
            title: "Message cannot be empty",
            status: "error",
            placement: "top",
          })
          return;
    }
    if(re.test(mobile_no)){
        const data = {
            to: deviceId,
            action: "sendSMS",
            data:{ msg, mobile_no }
          };
          const finalData = JSON.stringify(data);
          nodejs.channel.post('cmd',finalData)
          setLoading(true);
    }else{
        toast.show({
            title: "Invalid Mobile Number",
            status: "error",
            placement: "top",
          })
    }
   }

   const handleResponse=(v)=>{
    if(JSON.parse(v)=="success"){
        toast.show({
            title: "SMS sent successfully!",
            status: "success",
            placement: "top",
          })
    }
    setLoading(false)
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
        <Text fontSize={'20'}  color={"secondary.500"}>Send SMS</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
      <Stack mt={3} space={4} >
        <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="Mobile No"
            variant={'filled'}
            value={mobile_no}
            keyboardType={'numeric'}
            onChangeText={(d)=>setMobile(d)}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="phone" />} size={5} ml="2"  color="muted.400" />}/>
         <Box flex={1} maxW="100%">
            <TextArea
                h={40} 
                size="md"
                placeholder="Message"
                value={msg}
                onChangeText={(d)=>setMsg(d)}
                w="100%" />
            </Box>    
      </Stack>
    </Box>
    <Button
     isLoading={loading}
     background={'tertiary.400'}
     onPress={()=>sendSms()}
     endIcon={<Icon as={MaterialCommunityIcons} name="send"  size="sm" color="pink.400" />}
     isLoadingText="Sending">
        Send
      </Button>
    </>
    )
};

export default SendSms;

  