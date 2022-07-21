/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import nodejs from "nodejs-mobile-react-native";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  "NativeBase",
  "Require cycle: node_modules/rn-fetch-blob/index.js"
]);
AppRegistry.registerComponent(appName, () => App);
nodejs.start("main.js");