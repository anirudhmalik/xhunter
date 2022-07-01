import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen'
// redux provider
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// redux
import { store, persistor } from './src/redux/store';
// theme provider
import { NativeBaseProvider } from 'native-base';


import AppNavigation from './src/navigation/AppNavigation';
import { customTheme } from './src/theme/customTheme'

export default function App() {
	useEffect(() => {
		SplashScreen.hide();
	  }, []);
	
	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
			 	<NativeBaseProvider theme={customTheme}>
					<NavigationContainer>
						<AppNavigation/>
					</NavigationContainer>
				</NativeBaseProvider>
			</PersistGate>
		</ReduxProvider>
	);
}
  