import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
  useWindowDimensions,
  Dimensions,Linking
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../consts/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SecondaryButtontwo} from '../components/Button';
import GetLocation from 'react-native-get-location';
import {PermissionsAndroid} from 'react-native';
import {mainBaseUrl} from '../../../properties/UrlProperties';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {PrimaryButton} from '../components/Button';
import {flaskBaseUrl} from '../../../properties/UrlProperties';
import {fbAuthToken} from '../../../properties/UrlProperties';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Card, ListItem, Button, Icon, Avatar} from 'react-native-elements';
import MapView, {Marker, Callout} from 'react-native-maps';

let screenwidth = Dimensions.get('window').width;
let screeheight = Dimensions.get('window').height;

const RescuerHome = ({navigation}) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Rescue Requests'},
    {key: 'second', title: 'Accepted Requests'},
  ]);

  const [userTree, setUserTree] = useState([]);
  const [userfname, setUserfname] = useState();
  const [userlname, setUserlname] = useState();
  const [username, setUsername] = useState();
  const [useremail, setUseremail] = useState();
  const [userphone, setUserphone] = useState();
  const [showFBresult, setFBresult] = useState(false);

  const [reqRes, setReqRes] = useState(false);
  const [commentList, setcommentList] = useState();
  const [userId, setUserId] = useState();
  const [requests, setRequests] = useState([]);

  const [long, setlong] = useState();
  const [lat, setlat] = useState();
  const [noofDetections, setNoOfRescues] = useState();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [acceptedList, setAcceptedList] = useState([]);

  useEffect(async () => {
    AsyncStorage.getItem('rescuerLoginResponse').then(value =>
      setUserTree(JSON.parse(value).rescuerInfo),
    ),
      AsyncStorage.getItem('rescuerLoginResponse').then(value =>
        setNoOfRescues(JSON.parse(value).rescuerInfo.requests.length),
      ),
      AsyncStorage.getItem('rescuerLoginResponse').then(value =>
        setRequests(JSON.parse(value).rescuerInfo.requests),
      );
    AsyncStorage.getItem('rescuerLoginResponse').then(value =>
      setAcceptedList(JSON.parse(value).rescuerInfo.acceptedDetection),
    );

    // _getlocation;
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        setlong(location.longitude);
        setlat(location.latitude);
        AsyncStorage.setItem('dl', JSON.stringify(location));
      })
      .catch(error => {
        const {code, message} = error;
        // console.warn(code);
      });
  }, []);

  var stringArray = new Array();
  stringArray = userTree.requests;
  //   console.log("this is td>",stringArray[0].User_Location)

  // Rescue Requests --------------------------------------------------------------------------------------------------------------------------------------------
  const FirstRoute = () => (
    <ScrollView style={{flex: 1, backgroundColor: '#ffffff'}}>
      {/* MODAL success------------------------------------------------------------------------------------------------------------------- */}
      <Modal style={{flex: 1}} transparent={true} visible={isModalVisible}>
        <View
          style={{
            backgroundColor: '#000000aa',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.0)',
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderRadius: 23,
            }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                paddingVertical: 30,
                borderTopColor: 'black',
                paddingHorizontal: 30,
                borderRadius: 23,
                width: 340,
              }}>
              <TouchableOpacity onPress={() => setModalVisibility(false)}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#222222',
                      }}></Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text>X</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomColor: '#d3d3d3',
                  borderBottomWidth: 1,
                  padding: 10,
                }}></View>
              <View
                style={{
                  alignItems: 'center',
                  alignContent: 'center',
                  marginTop: 5,
                  marginBottom: 30,
                }}>
                {/* <Image
                                                        style={{ width: 60, height: 60 }}
                                                        source={require('../assets/warning.gif')}
                                                    /> */}
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: 10,
                    color: COLORS.secondary,
                    fontWeight: 'bold',
                  }}>
                  Thank you!
                </Text>
                <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                  for accepting the rescue request
                </Text>
              </View>
              <TouchableOpacity
                style={styles.signIn}
                // onPress={() => {loginHandle( data.username, data.password )}}

                onPress={() => {
                  setModalVisibility(false);
                }}>
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.secondary]}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    OK
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
                left: 50,
                right: 50,
              }}>
              <TouchableOpacity
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: COLORS.secondary,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setModalVisibility(false);
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  {/* <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>OK</Text> */}
                  <FontAwesome
                    name="check-circle-o"
                    color={COLORS.white}
                    size={70}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL success------------------------------------------------------------------------------------------------------------------- */}
      {requests.map((as, index) => (
        <View key={index}>
          {/* <View style={}></View> */}

          <Card>
            <Card.Title style={{fontSize: 20}}>Notification </Card.Title>
            <Card.Divider />
            {/* <Card.Image
              source={
                as.Final_Label == 'Cobra'
                  ? require('../../assets/cobra.png')
                  : as.Final_Label == "Russell's Viper"
                  ? require('../../assets/viper.png')
                  : require('../../assets/updatedlogo.png')
              }
              style={{height: 150, width: 150, left: 80, right: 80}}
            /> */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>{as.User_name}</Text>
              <Text>from</Text>
              <Text style={{fontWeight: 'bold'}}>
                <TouchableOpacity onPress={() => _openGoogleMaps( as.Longitude,as.Latitude)}>
                  <Text>{as.User_Location}</Text>
                </TouchableOpacity>
              </Text>

              <MapView
                style={styles.map}
                region={{
                  latitude: as.Latitude,
                  longitude: as.Longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker
                  coordinate={{
                    latitude: as.Latitude,
                    longitude: as.Longitude,
                  }}
                  image={require('../../assets/resmarker.png')}
                  title="Snake"
                  description="sample description">
                  <Callout tooltip>
                    <View>
                      <View style={styles.bubble}>
                        <Text style={styles.name}>{as.Final_Label}</Text>
                        {/* <Text style={styles.name}>sample description</Text> */}
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>
                  </Callout>
                </Marker>
              </MapView>

              <Text style={{marginBottom: 20, marginTop: 20}}>
                is requesting you to rescue a {as.Final_Label} he/she has
                detected. (Phone - {as.User_phoneNo})
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 25}}>
                {as.Final_Label}
              </Text>
              <View style={{width: 300}}>
                <SecondaryButtontwo
                  title="Accept Rescue Request"
                  onPress={() => _acceptRequest(as.ID)}
                />
              </View>
            </View>
          </Card>
        </View>
      ))}
    </ScrollView>
  );
  // Rescue Requests --------------------------------------------------------------------------------------------------------------------------------------------

  // Accepted Detections ---------------------------------------------------------------------------------------------------------------------------------------
  const SecondRoute = () => (
    <ScrollView style={{flex: 1, backgroundColor: '#ffffff'}}>
      {acceptedList.map((as, index) => (
        <View key={index}>
          {/* <View style={}></View> */}

          <Card>
            <Card.Title style={{fontSize: 20}}>Notification</Card.Title>
            <Card.Divider />
            {/* <Card.Image
            source={
              as.Final_Label == 'Cobra'
                ? require('../../assets/cobra.png')
                : as.Final_Label == "Russell's Viper"
                ? require('../../assets/viper.png')
                : require('../../assets/updatedlogo.png')
            }
            style={{height: 150, width: 150, left: 80, right: 80}}
          /> */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>{as.User_name}</Text>
              <Text>from</Text>
            <View>
              </View>
                <TouchableOpacity>
                  <Text>{as.User_Location}</Text>
                </TouchableOpacity>
              
              <MapView
                style={styles.map}
                region={{
                  latitude: as.Latitude,
                  longitude: as.Longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker
                  coordinate={{
                    latitude: as.Latitude,
                    longitude: as.Longitude,
                  }}
                  image={require('../../assets/resmarker.png')}
                  title="Snake"
                  description="sample description">
                  <Callout tooltip>
                    <View>
                      <View style={styles.bubble}>
                        <Text style={styles.name}>{as.Final_Label}</Text>
                        {/* <Text style={styles.name}>sample description</Text> */}
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>
                  </Callout>
                </Marker>
              </MapView>

              <Text style={{marginBottom: 20, marginTop: 20}}>
                is waiting for you to rescue a {as.Final_Label} he/she has
                detected. (Phone - {as.User_phoneNo})
              </Text>
            </View>
          </Card>
        </View>
      ))}
    </ScrollView>
  );
  // Accepted Detections ---------------------------------------------------------------------------------------------------------------------------------------
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const googleMapOpenUrl = ({ latitude, longitude }) => {
    const latLng = `${latitude},${longitude}`;
    return `google.navigation:q=${latLng}`;
  }
  const _openGoogleMaps=(long,lat)=>{
    console.log("come inside to open maps")
    Linking.openURL(googleMapOpenUrl({ latitude: lat, longitude: long }));
  }
  const _goToMapView = (long, lat) => {
    console.log('long and lat >', long, lat);
    AsyncStorage.setItem('latreq', JSON.stringify(lat));
    AsyncStorage.setItem('longreq', JSON.stringify(long));
    navigation.navigate('RescuerMapViewReq');
  };
  const _acceptRequest = detectionID => {
    console.log('comes inside');
    let reqbody = JSON.stringify({
      id: userTree.id,
      detection_Id: detectionID,
    });

    fetch(
      'http://34.125.192.137:8080/Rescuer/acceptedDetections/' + userTree.id,
      {
        method: 'POST',
        body: reqbody,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setReqRes(responseJson.responseCode);
        console.log('this is res code> ', responseJson.responseCode);

        if (responseJson.responseCode == 200) {
          setModalVisibility(true);
          setTimeout(() => {
            setModalVisibility(false);
          }, 2000);
        }
      })
      .catch(console.log('ISSUES !'));
  };
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBar}>
          <View style={styles.header}>
            <FontAwesome
              name="chevron-left"
              size={28}
              onPress={() => navigation.goBack()}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}> log out</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RescuerNotifications')}>
              <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 160}}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignSelf: 'center'}}>
          <View style={styles.profileImage}>
            <FontAwesome
              name="user-circle-o"
              color={COLORS.primary}
              size={100}
            />
          </View>

          <View style={styles.active}></View>
          <View style={styles.add}>
            {/* <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>  */}
            <FontAwesome name="check-circle-o" size={20} color="#DFD8C8" />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.text, {fontWeight: '200', fontSize: 25}]}>
            {userTree.fname} {userTree.lname}
          </Text>
          <Text style={[styles.text, {color: '#AEB5BC', fontSize: 14}]}>
            {userTree.location}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, {fontSize: 24}]}> {noofDetections}</Text>
            <Text style={[styles.text, styles.subText]}>Rescues</Text>
          </View>
          <View
            style={[
              styles.statsBox,
              {borderColor: '#DFD8C8', borderLeftWidth: 1, borderRightWidth: 1},
            ]}>
            <Text style={[styles.text, {fontSize: 18}]}>
              {userTree.phoneNo}
            </Text>
            <Text style={[styles.text, styles.subText]}>Mobile</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, {fontSize: 12}]}>long - {long}</Text>
            <Text style={[styles.text, {fontSize: 12}]}>lati - {lat}</Text>
            <Text style={[styles.text, styles.subText]}>Current Location</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={{flex: 1.4}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar {...props} style={{backgroundColor: '#2d2d2d'}} />
          )}
        />
      </View>
    </View>
  );
};
export default RescuerHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'HelveticaNeue',
    color: '#52575D',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 50,
  },
  dm: {
    backgroundColor: '#41444B',
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    bottom: 10,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: '#41444B',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  statsBox: {
    alignItems: 'center',
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: '#DFD8C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaCount: {
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.38)',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: '#CABFAB',
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'absolute',
  },
  map: {
    height: screeheight / 4 - 20,
    width: (screenwidth * 2.5) / 3,
    marginTop: 20,

    bottom: 10,
  },
});
