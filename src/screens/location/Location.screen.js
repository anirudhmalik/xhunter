import React, { useEffect, useState } from "react";
import { WebView } from 'react-native-webview';
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Button,
    Spinner,
    Spacer,
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';


// redux
import { useDispatch, useSelector } from '../../redux/store';
import { setIsLoading, resetLocation } from '../../redux/slices/userInfo'

const Location = ({navigation,route}) => {
  const dispatch = useDispatch();
  const { deviceId } = route.params;
  const { location, devices, isLoadingData } = useSelector((state) => state.userInfo);
  const [refresh, setRefresh]=useState(true);
  const [zoom, setZoom]=useState(16);
  const [zoomIn, setZoomIn]=useState(true);
  const [zoomOut, setZoomOut]=useState(true);

  useEffect(()=>{
    _getLocation();
    dispatch(resetLocation())
  },[])

  const _getLocation=()=>{
    const data = {
      to: deviceId,
      action: "getLocation",
      data:""
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
    dispatch(setIsLoading(true));
   }
const handleZoomIn=()=>{
    setRefresh(false);
    setZoomIn(false);
    setZoom(zoom+1);
    setTimeout(()=>{
        setRefresh(true);
        setZoomIn(true);
    },1000)
}
const handleZoomOut=()=>{
    setRefresh(false);
    setZoomOut(false)
    setZoom(zoom-1);
    setTimeout(()=>{
        setRefresh(true);
        setZoomOut(true);
    },1000)
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
           <Text fontSize={'20'}  color={"secondary.500"}>Location</Text>
           <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
    <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="map-marker" color={"tertiary.500"} size="5" mr="1"/>
            <Box>
            {location&&<Text noOfLines={1} fontSize={'16'} color={"white"}>Latitude: {location.lat}</Text>}
            {location&&<Text noOfLines={1} fontSize={'16'} color={"white"}>Longitude: {location.long}</Text>}
            </Box>
            <Spacer/>
            </HStack>
     </Box>
        {isLoadingData&&<Spinner color="secondary.500" />}
        {!isLoadingData&&location&&<Box flex={1}>
            {refresh&&<WebView style={{borderRadius:10}} source={{ uri: `https://www.google.com/maps/@${location.lat},${location.long},${zoom}z` }} />}
            <Box zIndex={100} position={'absolute'} h={'100%'} w={'100%'} >
                <Box flex={0.7} alignItems={'center'} justifyContent={'center'}>
                        {refresh&&<Icon as={MaterialCommunityIcons} name="map-marker" color={"error.600"} size={6}/>}
                </Box>
                <Box flex={0.4}  bg={'primary'}>
                    <Box flexDirection={'row'} justifyContent={'center'} mt={4} mx={4}>
                        <Button
                            isLoading={!zoomIn} 
                            isLoadingText="loading" 
                            variant={'outline'} 
                            colorScheme={'tertiary'}
                            onPress={handleZoomIn}
                            leftIcon={<Icon as={MaterialCommunityIcons} name="earth-plus" color={"success.500"} size="5" mr="1"/>}>
                            Zoom In
                        </Button>
                        <Spacer/>
                        <Button 
                            isLoading={!zoomOut} 
                            isLoadingText="loading" 
                            variant={'outline'} 
                            colorScheme={'tertiary'}
                            onPress={handleZoomOut}
                            leftIcon={<Icon as={MaterialCommunityIcons} name="earth-minus" color={"error.500"} size="5" mr="1"/>} >
                            Zoom Out
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>}
    </Box>
    </>
    )
};

export default Location;
  