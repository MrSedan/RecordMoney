import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import styled from 'styled-components/native'

import Debt from './views/debts/Debt';
import Home from './views/home/Home';
import PiggyBank from './views/piggybanks/PiggyBank';
import Calendar from './views/calendar/Calendar';
import Account from './views/accounts/Account';
import Advice from './views/advices/Advice';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {

  const [fonstsLoaded] = useFonts({
    'Montserrat': require('./assets/font/Montserrat-VariableFont_wght.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fonstsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fonstsLoaded]);

  if (!fonstsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#C9C9C9" }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }} initialRouteName='Home'>
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='Calendar' component={Calendar} />
          <Tab.Screen name='Debt' component={Debt} />
          <Tab.Screen name='PiggyBank' component={PiggyBank} />
          <Tab.Screen name='Account' component={Account} />
          <Tab.Screen name='Advices' component={Advice} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}