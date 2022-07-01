import React from 'react';
import { Modal } from 'react-native';
import { Box, Image, IconButton, Icon, Spinner, HStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ImagePreviewScreen = ({visible1, setVisible1, imageData}) => {
  return (
    <Modal
      animationType="fade"
      visible={visible1}
      transparent={true}
      onRequestClose={() => {
        setVisible1(false)
      }}>
      <Box flex={1} justifyContent={"center"} px={5} >
            <Box w="100%" pb={10} background="dark.200" px={5} alignItems={"center"} justifyContent={"center"} borderRadius={10}>
                <HStack py={4} w={"100%"} justifyContent="flex-end" >
                <IconButton 
                onPress={()=> setVisible1(false)}
                icon={<Icon as={MaterialCommunityIcons} name="close-circle" />} 
                borderRadius="full" 
                _icon={{ color:  "tertiary.500", size: "sm"}} 
                _pressed={{ bg: "tertiary.800:alpha.20"}}   
                />
                </HStack>
                {imageData&&<Image source={{uri: imageData.image}} size={"2xl"} alt={"img"}/>}
                {!imageData&&<Spinner color="secondary.500" />}
            </Box>
      </Box>
    </Modal>
  );
};
export default ImagePreviewScreen;