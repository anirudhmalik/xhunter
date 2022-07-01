import React from 'react';
import { Modal } from 'react-native';
import { Box, Image, Text} from 'native-base';

const ConnectingScreen = ({visible, title='Please wait, loading'}) => {

  return (
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle={'overFullScreen'}
      onRequestClose={() => {
        console.log('back button pressed');
      }}>
      <Box flex={1} justifyContent={"center"} bg={"primary"} px={'10'} >
       <Image source={require('./../assets/gif/loading.gif')} height={350} alt="loading"/>
        <Text textAlign={'center'} color={'secondary.500'}>{title}</Text>
      </Box>
    </Modal>
  );
};
export default ConnectingScreen;