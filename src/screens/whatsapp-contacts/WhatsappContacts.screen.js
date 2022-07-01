import React from "react";
import { 
    Box,
    StatusBar,
    HStack,
    IconButton,
    Icon,
    Text,
    Progress,
    FlatList, 
    Spacer,
    Pressable,
    VStack,
    Fab
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WhatsappContacts = ({navigation,route}) => {
  const { contactList } = route.params;
 
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop  bg={"primary"} />

    <Box flex={1} bg={"primary"} px={'2'} >
    <HStack my="4" alignItems="center" borderBottomWidth="1" borderBottomColor={'secondary.500'} >
      <IconButton 
         onPress={()=>navigation.goBack()}
         pr={30}
         icon={<Icon as={MaterialCommunityIcons} name="chevron-left-circle" />} 
         borderRadius="full" 
         _icon={{ color:  "tertiary.500", size: "sm"}} 
         _pressed={{ bg: "tertiary.800:alpha.20"}}            
         />
        <Text fontSize={'20'}  color={"secondary.500"}>Whatsapp Contacts</Text>
    </HStack>
    <FlatList 
        data={contactList} 
        renderItem={({item}) => 
        <Box bg="dark.100" borderRadius='5' py="4" px="2" mb='2'>
            <HStack flex={1} space={3} alignItems={'center'}>
            <Icon as={MaterialCommunityIcons} name={"account-circle"} color={"success.400"} size="10" mr="1"/>
           <VStack flex={1} space={3}>
            <HStack flex={1} justifyContent={"space-between"} >
            <Text noOfLines={1} fontSize={'18'} color={"white"}>{item.display_name?item.display_name:""}{" ( +"+item.jid.substr(0,item.jid.lastIndexOf("@"))+" )"}</Text>
            </HStack>   
            <HStack alignItems={"center"}>
            <Text noOfLines={3} fontSize={'12'} color={"secondary.500"}>{item.status} </Text>
            </HStack>
           </VStack>
            </HStack>
        </Box>
        } 
        keyExtractor={item => item.jid}
        />
    </Box>
    </>
    )
};

export default WhatsappContacts;
  