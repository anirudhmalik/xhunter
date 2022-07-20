import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { Box, Stack, Input, Icon, Button, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import nodejs from 'nodejs-mobile-react-native';

import AppBuilder from '../native-modules/AppBuilder'

const CustomServerConfigScreen = ({visible, setVisible}) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [config, setConfig]= useState({
        user:"",
        host:"",
        pass:"",
        rport:8080,
        lhost:"localhost",
        lport:8080
      });
    useEffect(()=>{
        setLoading(false);

    },[])  
    const handleCustomTunnel = async()=>{
        setLoading(true);
        AppBuilder.sshTunnel(config, (type, message)=>{
          if(type=="s"){
            nodejs.channel.post('startListener',"")
          }else{
            setError(message)
          }
          setLoading(false);
        });
      }
  return (
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle={'overFullScreen'}
      onRequestClose={() => {setVisible(false)}}>
      <Box flex={1} justifyContent={"center"} bg={"primary"} px={'10'} >
      <Stack mt={3} space={4} >
        {config.user!==""&&config.host!==""&&<Text fontSize="sm">{config.user}@{config.host}</Text>}
        <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="User i.e.     ubuntu, root etc"
            variant={'filled'}
            value={config.user}
            onChangeText={(d)=>{
                setConfig({...config,user:d})
            }}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="account" />} size={5} ml="2"  color="muted.400" />}/>
            <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="IP or Host i.e. 13.128.65.145, google.com"
            variant={'filled'}
            value={config.host}
            onChangeText={(d)=>{
                setConfig({...config,host:d})
            }}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="web" />} size={5} ml="2"  color="muted.400" />}/>
            <Input
            size="md"
            w={{ base: "100%", md: "25%" }}
            placeholder="Password"
            variant={'filled'}
            value={config.pass}
            type={show ? "text" : "password"}
            onChangeText={(d)=>{
                setConfig({...config,pass:d})
            }}
            InputRightElement={<Icon as={<MaterialCommunityIcons name={show ? "eye" : "eye-off"} />} size={5} mr="2" color="muted.400" onPress={() => setShow(!show)} />}
            InputLeftElement={<Icon as={<MaterialCommunityIcons name="form-textbox-password" />} size={5} ml="2"  color="muted.400" />}/>
            {error!==""&&<Text color={"error.500"} fontSize="sm">{error}</Text>}
            <Button
                isLoading={loading}
                background={'tertiary.400'}
                onPress={()=>handleCustomTunnel()}
                endIcon={<Icon as={MaterialCommunityIcons} name="connection"  size="sm" />}
                isLoadingText="Connecting">
                Connect & listen
            </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
export default CustomServerConfigScreen;