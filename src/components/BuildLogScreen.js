import React,{ useRef } from 'react';
import { Modal } from 'react-native';
import { Box, FlatList, Button, Image, HStack, Icon, Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// redux
import { useSelector, useDispatch } from '../redux/store';
import { resetBuildPayloadLogs } from '../redux/slices/userInfo'

const BuildLog = ({visible, navigation}) => {
  const flatlistRef = useRef();
  const dispatch = useDispatch();
  const { buildPayloadLogs } = useSelector((state) => state.userInfo);
  const onPress=()=>{
    dispatch(resetBuildPayloadLogs())
    navigation.goBack();
  }
  return (
    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle={'overFullScreen'}
      onRequestClose={() => {
        console.log('back button pressed');
      }}>
      <Box flex={1} justifyContent={"center"} bg={"primary"} px={'4'} >
        <FlatList
        ref = {flatlistRef}
        onContentSizeChange={()=> flatlistRef.current.scrollToEnd()}
        data={buildPayloadLogs} 
        renderItem={({item})=>(<Line item={item} onPress={onPress} />)}
        />
        <Image mt="10" source={require('./../assets/gif/loading.gif')} height={250} alt="loading"/>
      </Box>
    </Modal>
  );
};
export default BuildLog;


const Line =({item, onPress})=>{
            let textColor="secondary.500"
            let iconColor="info.500"
            let iconName="info"
            if(item.type==="i"){
              textColor="info.400"
              iconColor="info.500"
              iconName="info"
            }else if(item.type==="s"){
              textColor="success.400"
              iconColor="success.500"
              iconName="done"
            }else if(item.type==="e"){
              textColor="error.400"
              iconColor="error.500"
              iconName="error"
            }else if(item.type==="w"){
              textColor="warning.400"
              iconColor="warning.500"
              iconName="warning"
            }else if(item.type==="done"){
              textColor="purple.400"
              iconColor="purple.500"
              iconName="anchor"
            }else if(item.type==="ex"){
              textColor="white"
              iconColor="teal.500"
              iconName="bug-report"
            }else if(item.type==="sp"){
              textColor="white"
              iconColor="yellow.600"
              iconName="chevron-right"
            }
         return(
           <>
            <HStack space={2} mr="4">
                <Icon as={MaterialIcons} name={iconName} color={iconColor} size="5"/>
                <Text color={textColor} fontSize="sm">{item.message}</Text>
            </HStack>
            {item.type==="e"&&<Button onPress={onPress} variant={'outline'} mt="10" colorScheme={'error'} size={'lg'} mb="10" borderRadius={10}>
              Exit
            </Button>}
            {item.type==="done"&&<Button onPress={onPress} variant={'outline'} mt="10" colorScheme={'purple'} size={'lg'} mb="10" borderRadius={10}>
              Done
            </Button>}
           </>
        )}