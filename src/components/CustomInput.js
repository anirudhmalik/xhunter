import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Box, Stack, Input, Icon, Button, Text, Pressable} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppBuilder from '../native-modules/AppBuilder'
// redux
import { useDispatch } from '../redux/store';
import { addBuildPayloadLogs } from '../redux/slices/userInfo'

const CustomInput = ({visible, setVisible, setVisibleLog}) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [url, setUrl]= useState("");
     
    const handleNext = async()=>{
        if(url!=""){
            setVisible(false)
            setVisibleLog(true)
            AppBuilder.buildPayload(`http://${url}:8080` ,addlog)
        }else{
            setError("Input cannot be empty")
        }
      }
    const addlog =( type, message ) => { 
        dispatch(addBuildPayloadLogs({ type, message})) 
    }
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      presentationStyle={'overFullScreen'}
      onRequestClose={() => {setVisible(false)}}>
      <Pressable flex={1} justifyContent={"center"} onPress={()=>setVisible(false)}>
      <Stack p={10} mb={10} borderRadius={5} space={4} bg={"primary"} borderColor={'gray.400'} borderWidth={1} >
        <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="IP or Host i.e. 13.128.65.145, google.com"
            variant={'filled'}
            value={url}
            onChangeText={(d)=>setUrl(d)}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="web" />} size={5} ml="2"  color="muted.400" />}/>
            {error!==""&&<Text color={"error.500"} fontSize="sm">{error}</Text>}
            <Button
                background={'tertiary.400'}
                onPress={()=>handleNext()}
                endIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench"  size="sm" />}>
                Build
            </Button>
        </Stack>
      </Pressable>
    </Modal>
  );
};
export default CustomInput;