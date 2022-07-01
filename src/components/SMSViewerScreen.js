import React from 'react';
import { Modal } from 'react-native';
import { Box, Text, IconButton, Icon, HStack, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";

const SMSViewerScreen = ({visible, setVisible, sms}) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={() => {
        setVisible(false)
      }}>
      <Box flex={1} justifyContent={"center"} px={5} >
            <Box w="100%" pb={10} background="dark.200" px={5} alignItems={"center"} justifyContent={"center"} borderRadius={10}>
                <HStack py={4} w={"100%"} justifyContent="space-between" alignItems={"center"} >
                    <VStack>
                        <Text noOfLines={1} fontSize={'18'} color={"secondary.500"}>{sms.number}</Text>
                        <Text noOfLines={1} fontSize={'14'} color={"secondary.500"}>{moment(sms.date).calendar()}</Text>
                    </VStack>
                <IconButton 
                onPress={()=> setVisible(false)}
                icon={<Icon as={MaterialCommunityIcons} name="close-circle" />} 
                borderRadius="full" 
                _icon={{ color:  "tertiary.500", size: "sm"}} 
                _pressed={{ bg: "tertiary.800:alpha.20"}}   
                />
                </HStack>
                <Text fontSize={'14'} color={"secondary.500"}>{sms.body} </Text>
            </Box>
      </Box>
    </Modal>
  );
};
export default SMSViewerScreen;