import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import Debt from './views/debts/Debt';
import Home from './views/home/Home';
import PiggyBank from './views/piggybanks/PiggyBank';
import Calendar from './views/calendar/Calendar';
import Account from './views/accounts/Account';
import Advice from './views/advices/Advice';
import { View } from 'react-native';

import HomeSvg from './assets/icon/Home.svg'
import CalendarSvg from './assets/icon/Calendar.svg'
import WalletSvg from './assets/icon/Wallet.svg'
import PiggyBankSvg from './assets/icon/PiggyBank.svg'

import HomeFocusedSvg from './assets/icon/HomeFocused.svg'
import CalendarFocusedSvg from './assets/icon/CalendarFocused.svg'
import WalletFocusedSvg from './assets/icon/WalletFocused.svg'
import PiggyBankFocusedSvg from './assets/icon/PiggyBankFocused.svg'

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
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            title: '',
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Home') {
                return !focused ? <HomeSvg width={size} height={size} /> : <HomeFocusedSvg width={size} height={size} />
              } else if (route.name === 'Calendar') {
                return !focused ? <CalendarSvg width={size} height={size} /> : <CalendarFocusedSvg width={size} height={size} />
              } else if (route.name === 'Wallet') {
                return !focused ? <WalletSvg width={size} height={size} /> : <WalletFocusedSvg width={size} height={size} />
              } else if (route.name === 'PiggyBank') {
                return !focused? <PiggyBankSvg width={size} height={size} /> : <PiggyBankFocusedSvg width={size} height={size} />
              } else {
                return !focused ? <WalletSvg width={size} height={size} /> : <WalletFocusedSvg width={size} height={size} />
              }
            }
          })} initialRouteName='Home'>
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