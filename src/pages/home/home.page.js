import React, { useState } from 'react';
import { 
  View
} from 'react-native';
import MapView from 'react-native-maps';
import { styles } from './home.styles';

const HomePage = () => {
  return (
    <View style={styles.container}>
      
      <MapView
        style={styles.map}
        loadingEnabled={true}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />

    </View>
  );
}

export default HomePage;