import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {View} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SankeList from '../screens/SankeList';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetectionScreen from '../screens/DetectionScreen';


const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: 55,
          borderTopWidth: 1,
          elevation: 0,
        },
        showLabel: false,
        activeTintColor: COLORS.primary,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="LocalMall"
        component={SankeList}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="history" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={CameraScreen}
        options={{
          tabBarIcon: ({color}) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderColor: COLORS.secondary,
                borderWidth: 2,
                borderRadius: 30,
                top: -25,
                elevation: 5,
              }}>
              <Icon name="camera" color={COLORS.primary} size={28} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="favorite" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="person" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
