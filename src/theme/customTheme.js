import { extendTheme, theme as nbTheme } from 'native-base';
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
	useSystemColorMode: false,
	initialColorMode: "dark",
  };

export const customTheme = extendTheme({
  config,	
  colors: {
    primary: nbTheme.colors.black,
    secondary: nbTheme.colors.cyan,
    tertiary: nbTheme.colors.blue
  },
});