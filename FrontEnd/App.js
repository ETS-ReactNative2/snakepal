import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider, Box} from 'native-base';
import COLORS from './src/consts/colors';
import DetailsScreen from './src/views/screens/DetailsScreen';
import BottomNavigator from './src/views/navigation/BottomNavigator';
import OnBoardScreen from './src/views/screens/OnBoardScreen';
import FirstScreen from './src/views/screens/FirstScreen';
import SecondScreen from './src/views/screens/SecondScreen';
import CameraScreen from './src/views/screens/CameraScreen';
import ProfileScreen from './src/views/screens/ProfileScreen';
import MapScreen from './src/views/screens/MapScreen';
import DetectionScreen from './src/views/screens/DetectionScreen';
import SignIn from './src/views/screens/SignIn';
import SignUp from './src/views/screens/SignUp';
import RescuerNotifications from './src/views/screens/RescuerNotifications';
import RescuerLogin from './src/views/screens/RescuerLogin';
import RescuerHome from './src/views/screens/RescuerHome';
import DetectionDetails from './src/views/screens/DetectionDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="FirstScreen">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="FirstScreen" component={FirstScreen} />
          <Stack.Screen name="SecondScreen" component={SecondScreen} />
          <Stack.Screen name="BoardScreen" component={OnBoardScreen} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Home" component={BottomNavigator} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="DetectionScreen" component={DetectionScreen} />
          <Stack.Screen
            name="RescuerNotifications"
            component={RescuerNotifications}
          />
          <Stack.Screen name="RescuerLogin" component={RescuerLogin} />
          <Stack.Screen name="RescuerHome" component={RescuerHome} />
          <Stack.Screen name="DetectionDetails" component={DetectionDetails} />
        
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
