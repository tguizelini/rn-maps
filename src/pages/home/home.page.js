import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid
} from 'react-native';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';

import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { styles } from './home.styles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAvlhWaC5-eob9rrDIJGw7zXRPGA15GK64';

const HomePage = () => {
  const [origin, setOrigin] = useState({ latitude: 42.3616132, longitude: -71.0672576 });
  const [destination, setDestination] = useState({ latitude: 42.3730591, longitude: -71.033754 });
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  useEffect(() => {
    getLocation();
  }, []);

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
              'title': 'App Location Permission',
              'message': 'Maps App needs access to your map ' +
                  'so you can be navigated.'
          }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
          return true;

      } else {
          console.log("location permission denied");
          return false;
      }

    } catch (err) {
        console.warn(err)
    }
  }

  getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
        let newOrigin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        console.log('new origin');
        console.log(newOrigin);

        setOrigin(newOrigin);

    }, (err) => {
        console.log('error');
        console.log(err)

    }, {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000})

  };

  handleButton = () => {
    if(originText != '') {
      Geocoder.init(GOOGLE_MAPS_APIKEY); // use a valid API key

      Geocoder.from(originText)
        .then(json => {
          let location = json.results[0].geometry.location;
          
          console.log(location);

          setOrigin({ latitude: location.lat, longitude: location.lng });

      })
      .catch(error => console.warn(error));

    }
    else {
      alert("Digite a origem ! ");
    }

    if(destinationText != '') {
      Geocoder.init(GOOGLE_MAPS_APIKEY); // use a valid API key

      Geocoder.from(destinationText)
        .then(json => {
          let location = json.results[0].geometry.location;
          
          console.log(location);

          setDestination({ latitude: location.lat, longitude: location.lng });

        })
        .catch(error => console.warn(error));
    }
    else {
      alert("Digite o destino ! ")
    }
  }

  handleGetGoogleMapDirections = () => {
    const data = {
      source: origin,
      destination: destination,
      params: [
          {
            key: "travelmode",
            value: "driving"
          }
        ]
    };

    getDirections(data);
  };

  return (
    <View style={styles.container}>
      
      <MapView
    
              ref={map => mapView = map}
              style={styles.map}
    
              region={{
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2,
                latitudeDelta: Math.abs(origin.latitude - destination.latitude) + Math.abs(origin.latitude - destination.latitude) * .1,
                longitudeDelta: Math.abs(origin.longitude - destination.longitude) + Math.abs(origin.longitude - destination.longitude) * .1,
              }}
    
              loadingEnabled={true}
              toolbarEnabled={true}
              zoomControlEnabled={true}
              
            >
    
            <MapView.Marker
              coordinate={destination}
            >
              <MapView.Callout onPress={handleGetGoogleMapDirections}>
                <Text>Press to Get Direction</Text>
              </MapView.Callout>
            </MapView.Marker>

            <MapView.Marker
              coordinate={origin}
            >
            <MapView.Callout>
                <Text>This is where you are</Text>
            </MapView.Callout>
            </MapView.Marker>

            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
            />
    
            </MapView>

            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setOriginText(text)}
                    placeholder='Origem'
                    value={originText}
                />

                 <TextInput
                    style={styles.input}
                    onChangeText={(text) => setDestinationText(text)}
                    placeholder='Destino'
                    value={destinationText}
                />

                <TouchableOpacity style={styles.button} onPress={handleButton}>

                    <Text style={styles.buttonText}>Buscar rota</Text>

                </TouchableOpacity>
    
            </View>

    </View>
  );
}

export default HomePage;