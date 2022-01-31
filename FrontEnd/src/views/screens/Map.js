
import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
    <View style={styles.container}>
     <MapView
    // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: 6.8568,
         longitude: 79.8729,
         latitudeDelta:  6.8568,
         longitudeDelta: 79.8729,
       }}
     >
     </MapView>
   </View>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });