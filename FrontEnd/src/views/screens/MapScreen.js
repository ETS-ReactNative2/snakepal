
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, ScrollView, Animated, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout, } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

let screenwidth = Dimensions.get('window').width;
let screeheight = Dimensions.get('window').height;

const CARD_HEIGHT = 220;
const CARD_WIDTH = CARD_WIDTH * 0.8;


const MapScreen = ({ navigation, route }) => {

  const [long, setlong] = useState();
  const [lat, setlat] = useState();

  useEffect(() => {
    // navigator.geolocation.requestAuthorization();
    AsyncStorage.getItem('addedLon')
      .then((value) =>
        setlong(JSON.parse(value)),
      )
    AsyncStorage.getItem('addedLat')
      .then((value) =>
        setlat(JSON.parse(value)),
      )
    console.log("lat: " + lat + "   long: " + long)

    //     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + 'AIzaSyBFrDFeUOta9yEgYtgpH8ebRK2kKRfPW6w')
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
    // })

  })



  return (
    <View>
      <View style={styles.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details</Text>
      </View>
      <View style={styles.container}>
        <MapView
          // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
            image={require('../../assets/markernew.png')}

            title="Snake"
            description="sample description"
          >
            <Callout tooltip>
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>Russel Viper</Text>
                  {/* <Text style={styles.name}>sample description</Text> */}
                  <Image style={styles.image}
                    source={require('../../assets/viper.png')}
                  />

                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
          </Marker>
        </MapView>
      </View>
    </View>
  );
}


export default MapScreen;

const styles = StyleSheet.create({
  container: {


    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    height: screeheight - 80,
    width: screenwidth,
    marginTop: 80


  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'absolute'
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32

  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,

  }
  ,
  name: {
    fontSize: 16,
    marginBottom: 5
  },
  image: {
    width: 50,
    height: 50
  }
});