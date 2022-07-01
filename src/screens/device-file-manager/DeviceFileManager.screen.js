import React, { useEffect, useState } from "react";
import { 
    Box,
    Button,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Pressable,
    FlatList, 
    Spacer,
    Spinner,
    VStack,
    Progress
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';
import { Modal } from 'react-native';
// redux
import { useSelector } from '../../redux/store';
import ImagePreviewScreen from "../../components/ImagePreviewScreen";

const DeviceFileManager = ({navigation,route}) => {
  const { deviceId } = route.params;
  const { devices } = useSelector((state) => state.userInfo);
  const [currentDirData, setCurrentDirData]=useState([])
  const [currentPath, setCurrentPath]=useState("")
  const [visible, setVisible]=useState(false)
  const [visible1, setVisible1]=useState(false)
  const [imageData, setImageData]=useState("")
  const [transferPercentage, setTransferPercentage]=useState(0)

  useEffect(()=>{
    _getRootDir();
    nodejs.channel.addListener("getDir", onGetDir, this);
    nodejs.channel.addListener("previewImage", handlePreviewImage, this);
    nodejs.channel.addListener("download", (d)=>setTransferPercentage(d), this);
  },[])

  const _getRootDir=()=>{
    const data = {
      to: deviceId,
      action: "getDir",
      data:"/"
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
   }

  const _getDir=(path)=>{
    const data = {
      to: deviceId,
      action: "getDir",
      data:currentPath+"/"+path
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
    setCurrentPath(currentPath+"/"+path)
    setCurrentDirData([])
   }

  const goBack=()=>{
    let path=currentPath.substring(0,currentPath.lastIndexOf("/"));
    const data = {
      to: deviceId,
      action: "getDir",
      data:path
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
    setCurrentPath(path)
    setCurrentDirData([])
  }

  const onGetDir=(data)=>{
    setCurrentDirData(JSON.parse(data));
   }

  const downloadFile=(filePath)=>{
    setVisible(true)
    setTransferPercentage(0)
    const data = {
      to: deviceId,
      action: "download",
      data:filePath
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
   }

  const previewImage=(filePath)=>{
    setImageData("");
    setVisible1(true);
    const data = {
      to: deviceId,
      action: "previewImage",
      data:filePath
    };
    const finalData = JSON.stringify(data);
    nodejs.channel.post('cmd',finalData)
   }

  const handlePreviewImage=(d)=>{
    setImageData(JSON.parse(d))
   }
  
  const  formatBytes=(bytes, decimals = 2)=> {
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
    <HStack my="4" alignItems="center" justifyContent={'space-between'} borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text fontSize={'20'}  color={"secondary.500"}>File Manager</Text>
        <Box flexDirection={'row'} alignItems='flex-end'>
            <Icon as={MaterialCommunityIcons} name="signal" color={devices[deviceId].connected?'success.500':'error.500'} size="5" mr="1"/>
            <Text fontSize={'12'} color={"secondary.500"}>{devices[deviceId].connected?'online':'offline'}</Text>
        </Box>
    </HStack>
    {currentPath&&<Pressable onPress={()=>goBack()} >
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name="chevron-left-circle" color={"tertiary.500"} size="5" mr="1"/>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>...{currentPath}</Text>
            <Spacer/>
            </HStack>
        </Box>
    </Pressable>}
    {currentDirData.length<1&&<Spinner color="secondary.500" />}
    <FlatList 
        data={currentDirData} 
        renderItem={({ item }) => 
        <Pressable onPress={()=>devices[deviceId].connected&&item.isDirectory&&item.items>0&&_getDir(item.name)} >
        <Box bg="dark.100" borderRadius='5' py="4" px="4" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            {
            item.isDirectory?<Icon as={MaterialCommunityIcons} name={"folder"} color={"amber.400"} size="10" mr="1"/>:
            item.isImage?<Icon as={MaterialCommunityIcons} name={"file-image"} color={"teal.400"} size="10" mr="1"/>:
            <Icon as={MaterialCommunityIcons} name={"file"} color={"teal.400"} size="10" mr="1"/>
            }
           <VStack flex={1}>
            <Text noOfLines={1} fontSize={'16'} color={"secondary.500"}>{item.name}</Text>
            <Text fontSize={'12'} color={"secondary.500"}>{item.isDirectory?item.items+" items": "size "+formatBytes(item.size)} </Text>
           </VStack>
           {!item.isDirectory&&item.isImage&&<IconButton onPress={()=>devices[deviceId].connected&&previewImage(currentPath+"/"+item.name)} icon={<Icon as={MaterialCommunityIcons} name="eye" />} 
                                 borderRadius="full" 
                                 _icon={{ color:  "tertiary.500", size: "sm"}} 
                                 _pressed={{ bg: "tertiary.800:alpha.20"}}            
             />}
            {!item.isDirectory&&<IconButton onPress={()=>devices[deviceId].connected&&downloadFile(currentPath+"/"+item.name)} icon={<Icon as={MaterialCommunityIcons} name="download" />} 
                                 borderRadius="full" 
                                 _icon={{ color:  "tertiary.500", size: "sm"}} 
                                 _pressed={{ bg: "tertiary.800:alpha.20"}}            
             />}
            </HStack>
        </Box>
        </Pressable>
        } 
        keyExtractor={item => item.name} 
        />
    </Box>
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle={'overFullScreen'}
      transparent={true}
      onRequestClose={() => {
        console.log('back button pressed');
      }}>
      <Box flex={1} justifyContent={"center"} px={5} >
            <Box w="100%" py={10} background="dark.200" px={5} justifyContent={"center"} borderRadius={10}>
                <Progress colorScheme="success" size="md" value={transferPercentage} />
                <Text left='2' fontWeight={'bold'} fontSize={'14'} color={"white"}>{transferPercentage}%</Text>
                <Spacer/>
                <HStack pt={4} >
                <Spacer/>
                <Button onPress={()=>setVisible(false)}>{transferPercentage==100?"Done":"Cancel"}</Button>
                </HStack>
            </Box>
      </Box>
    </Modal>
    <ImagePreviewScreen visible1={visible1} setVisible1={setVisible1} imageData={imageData}/>
    </>
    )
};

export default DeviceFileManager;
  