import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Stack, Input, Icon, Button, Text, Pressable} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CustomInputBind = ({visible, setVisible, navigation}) => {
    const [error, setError] = useState("");
    const [url, setUrl]= useState("");
     
    const handleNext = async()=>{
        if(url!=""){
            setVisible(false)
            navigation.navigate('payloadBuilder',{url:`http://${url}:8080`})
        }else{
            setError("Input cannot be empty")
        }
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
                endIcon={<Icon as={MaterialCommunityIcons} name="arrow-right"  size="sm" />}>
                Next
            </Button>
        </Stack>
      </Pressable>
    </Modal>
  );
};
export default CustomInputBind;