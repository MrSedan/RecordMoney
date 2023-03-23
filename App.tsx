import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';

import Debt from './views/debts/Debt';
import Home from './views/home/Home';
import PiggyBank from './views/piggybanks/PiggyBank';
import Calendar from './views/calendar/Calendar';
import Advice from './views/advices/Advice';
import { View } from 'react-native';

import HomeSvg from './assets/icon/Home.svg';
import CalendarSvg from './assets/icon/Calendar.svg';
import WalletSvg from './assets/icon/Wallet.svg';
import PiggyBankSvg from './assets/icon/PiggyBank.svg';
import StatSvg from './assets/icon/Stat.svg';

import HomeFocusedSvg from './assets/icon/HomeFocused.svg';
import CalendarFocusedSvg from './assets/icon/CalendarFocused.svg';
import WalletFocusedSvg from './assets/icon/WalletFocused.svg';
import PiggyBankFocusedSvg from './assets/icon/PiggyBankFocused.svg';
import StatFocusedSvg from './assets/icon/StatActive.svg';

const Tab = createBottomTabNavigator();

export default function App() {
    const [loaded, setLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            'MainFont-Regular': require('./assets/font/Montserrat-Regular.ttf'),
            'MainFont-Bold': require('./assets/font/Montserrat-Bold.ttf'),
        });
    };

    useEffect(() => {
        async function loadApp() {
            await loadFonts();
            setLoaded(true);
        }
        loadApp();
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        title: '',
                        tabBarIcon: ({ focused, color, size }) => {
                            if (route.name === 'Home') {
                                return !focused ? (
                                    <HomeSvg width={size} height={size} />
                                ) : (
                                    <HomeFocusedSvg width={size} height={size} />
                                );
                            } else if (route.name === 'Calendar') {
                                return !focused ? (
                                    <CalendarSvg width={size} height={size} />
                                ) : (
                                    <CalendarFocusedSvg width={size} height={size} />
                                );
                            } else if (route.name === 'Wallet') {
                                return !focused ? (
                                    <WalletSvg width={size} height={size} />
                                ) : (
                                    <WalletFocusedSvg width={size} height={size} />
                                );
                            } else if (route.name === 'PiggyBank') {
                                return !focused ? (
                                    <PiggyBankSvg width={size} height={size} />
                                ) : (
                                    <PiggyBankFocusedSvg width={size} height={size} />
                                );
                            } else if (route.name === 'Advices') {
                                return !focused ? (
                                    <StatSvg width={size} height={size} />
                                ) : (
                                    <StatFocusedSvg width={size} height={size} />
                                );
                            } else {
                                return !focused ? (
                                    <WalletSvg width={size} height={size} />
                                ) : (
                                    <WalletFocusedSvg width={size} height={size} />
                                );
                            }
                        },
                        tabBarStyle: {
                            height: '8%',
                            display: 'flex',
                        },
                        lazy: true,
                    })}
                    initialRouteName='Home'
                >
                    <Tab.Screen name='Home' component={Home} />
                    <Tab.Screen name='Calendar' component={Calendar} />
                    <Tab.Screen name='Debt' component={Debt} />
                    <Tab.Screen name='PiggyBank' component={PiggyBank} />
                    <Tab.Screen name='Advices' component={Advice} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
