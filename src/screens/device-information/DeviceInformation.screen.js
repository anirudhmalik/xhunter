import React from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Spacer,
    Progress
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// redux
import { useSelector } from '../../redux/store';

const DeviceInformation = ({navigation, route}) => {
  const { deviceId } = route.params;
  const { devices } = useSelector((state) => state.userInfo);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
        <Text fontSize={'20'}  color={"secondary.500"}>Device Information</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
    {
    devices[deviceId]&&
     <><Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="cellphone" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Model</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{devices[deviceId].model}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="hammer" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Manufacture</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{devices[deviceId].manufacture}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="clock-time-eight-outline" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>App Install Time</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{devices[deviceId].appInstallTime}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="android" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Android</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{devices[deviceId].android}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="sim" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Sim</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{devices[deviceId].sim}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="battery" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>battery</Text>
            <Spacer/>
            <Box w="12">
                    <Progress colorScheme="success" size="md" value={Math.round(devices[deviceId].battery * 100)} />
                    <Text position={'absolute'} top='-1' left='2' fontWeight={'bold'} fontSize={'10'} color={"white"}>{Math.round(devices[deviceId].battery * 100)}%</Text>
                </Box>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="harddisk" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Free Disk Storage</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{formatBytes(devices[deviceId].freeDiskStorage)}</Text>
            </HStack>
        </Box>
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="harddisk" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>Total Disk Capacity</Text>
            <Spacer/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{formatBytes(devices[deviceId].totalDiskCapacity)}</Text>
            </HStack>
        </Box>
        </>}
    </Box>
    </>
    )
};

export default DeviceInformation;

  