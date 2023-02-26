import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Debt from './views/debts/Debt';
import Home from './views/home/Home';
import PiggyBank from './views/piggybanks/PiggyBank';
import Calendar from './views/calendar/Calendar';
import Account from './views/accounts/Account';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
        </Tab.Navigator>
      </NavigationContainer>
  );
}