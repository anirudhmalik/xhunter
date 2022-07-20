import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { Box, Stack, Input, Icon, Button, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';


const XhunterServerConnectingScreen = ({visible, setVisible}) => {
    const [url, setUrl]= useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(()=>{
        setLoading(false);
    },[])  
    const handleConnect = async()=>{
        setLoading(true);
        if(url != ""&&isUrlValid(url)){
            nodejs.channel.post('connect', url)
        }else{
            setError("Invalid url!")
            setLoading(false);
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
      presentationStyle={'overFullScreen'}
      onRequestClose={() => {setVisible(false)}}>
      <Box flex={1} justifyContent={"center"} bg={"primary"} px={'10'} >
      <Stack mt={3} space={4} >
        <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="https://your_app_name.herokuapp.com"
            variant={'filled'}
            value={url}
            onChangeText={(d)=>setUrl(d)}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="web" />} size={5} ml="2"  color="muted.400" />}/>
            {error!==""&&<Text color={"error.500"} fontSize="sm">{error}</Text>}
              <Button
                isLoading={loading}
                background={'tertiary.400'}
                onPress={()=>handleConnect()}
                endIcon={<Icon as={MaterialCommunityIcons} name="connection"  size="sm" />}
                isLoadingText="Connecting...">
                Connect & listen
            </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
export default XhunterServerConnectingScreen;