import React from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Pressable,
    FlatList,
    Spacer
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import { useSelector } from '../../redux/store';

const ClientManager = ({navigation,route}) => {
    const { deviceId } = route.params;
    const { devices } = useSelector((state) => state.userInfo);
 
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
        <Text fontSize={'20'}  color={"secondary.500"}>{devices[deviceId].model}</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>

    <FlatList 
        data={data} 
        renderItem={({ item }) => renderOptions(item, devices[deviceId].connected, navigation, deviceId)} 
        keyExtractor={item => item.id} 
        />

    </Box>
    </>
    )
};

export default ClientManager;

const renderOptions = (item, online, navigation, deviceId) =>{
    return(
        <Pressable onPress={()=>online&&navigation.navigate(item.navigate,{ deviceId: deviceId })} >
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={item.icon} color={item.iconColor} size="5" mr="1"/>
            <Text fontSize={'16'} color={"secondary.500"}>{item.option}</Text>
            <Spacer/>
            </HStack>
        </Box>
        </Pressable>
    )
}

const data = [
    {
        id:'0',
        icon:"cellphone",
        option:'Device Information',
        iconColor:'blue.500',
        navigate: 'deviceInformation'
    },
    {
        id:'1',
        icon:"android-messages",
        option:'Read SMS',
        iconColor:'success.500',
        navigate: 'sms'
    },
    {
        id:'2',
        icon:"folder",
        option:'File Manager',
        iconColor:'purple.500',
        navigate: 'deviceFileManager'
    },
    {
        id:'3',
        icon:"whatsapp",
        option:'Whatsapp Messages',
        iconColor:'success.500',
        navigate: 'whatsappMessages'
    },
    {
        id:'4',
        icon:"android",
        option:'Installed Apps',
        iconColor:'success.500',
        navigate: 'installedApps'
    },
    {
        id:'5',
        icon:"contacts",
        option:'Contacts',
        iconColor:'info.500',
        navigate: 'contacts'
    },
    {
        id:'6',
        icon:"phone",
        option:'Call Logs',
        iconColor:'yellow.500',
        navigate: 'callLogs'
    },
    {
        id:'7',
        icon:"send",
        option:'Send SMS',
        iconColor:'pink.500',
        navigate: 'sendSms'
    },
    {
        id:'8',
        icon:"map-marker",
        option:'GPS Location',
        iconColor:'error.500',
        navigate: 'location'
    }
]