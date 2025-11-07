import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './apps/screens/Login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
//import List from './apps/screens/List';
import Details from './apps/screens/Details';
import { FIREBASE_AUTH } from './FirebaseConfig';


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="My todos" component={List} />
      <InsideStack.Screen name="details" component={Details} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
    console.log('Auth state changed. Current user:', user);
    setUser(user);
    });
  }, []);

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      {user ? (
        <Stack.Screen name="InsideApp" component={InsideLayout} options={{ headerShown: false }} />
      ) : null}
        <Stack.Screen name="Login" component={Login} options = {{ headerShown: false}} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
  