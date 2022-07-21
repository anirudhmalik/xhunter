import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Stack, Input, Icon, Button, Text, Pressable} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppBuilder from '../native-modules/AppBuilder'

const CustomInput = ({visible, setVisible, setVisibleLog}) => {
    const [error, setError] = useState("");
    const [url, setUrl]= useState("");
     
    const handleNext = async()=>{
        if(url!= ""&&isUrlValid(url)){
            setVisible(false)
            setVisibleLog(true)
            AppBuilder.bindWhatsapp(url)
        }else{
            setError("Invalid host or url!")
        }
      }
    
    function isUrlValid(userInput) {
      var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if(res == null)
          return false;
      else
          return true;
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
            placeholder="https://xyz.herokuapp.com"
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