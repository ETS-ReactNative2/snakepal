'use strict';
import React, {useState, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import COLORS from '../../consts/colors';
import axios from 'axios';
import {mainBaseUrl} from '../../../properties/UrlProperties';
import GetLocation from 'react-native-get-location';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const CameraScreen = ({navigation}) => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [updatedtree, setTree] = useState(true);

  const [videoFile, setVideoFile] = useState('');
  const [userId, setUserID] = useState('');
  const [snakeDetections, setSnakeDetections] = useState([]);

  const [long, setlong] = useState();
  const [lat, setlat] = useState();

  const [singleFile, setSingleFile] = useState(null);
  const [videoname, setVideoName] = useState(null);
  useEffect(() => {
    console.log('okkkkkk');

    AsyncStorage.getItem('userRegistrationResponse').then(
      value => setUserID(JSON.parse(value).Info.id),
      // alert(userId)
    );
    // AsyncStorage.getItem('userLocation')
    //   .then((value) =>
    //     setlong(JSON.parse(value).longitude),
    //   )
    // AsyncStorage.getItem('userLocation')
    //   .then((value) =>
    //     setlat(JSON.parse(value).latitude),
    //   )
    // console.log("lat: " + lat + "   long: " + long)

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
  });
  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setSingleFile(res[0].uri);
      setVideoName(res[0].name)
      alert('Video Uploaded');
      _sendVideoforDetection();
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const takePicture = async function (camera) {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    console.log(data.uri);
  };
  const recordVideo = async function (camera) {
    ToastAndroid.showWithGravityAndOffset(
      'Recording...',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
    const options = {quality: 0.5, base64: true};
    const video = await camera.recordAsync(options);

    setVideoFile(video.uri);

    const path = video.uri;
    // const jsonValue = JSON.stringify(path)

    // if(jsonValue!=null){
    AsyncStorage.setItem('newVidPath', path);
    // }
  };
  const stopVideoRecording = async function (camera) {
    camera.stopRecording();
    _sendVideoforDetection();
  };

  const _sendVideoforDetection = () => {
    var date = new Date();
    console.log('this is date' + date);

    // console.log(AsyncStorage.getItem('newVidPath') +"------------------------------------------new new new")
    // AsyncStorage.getItem('newVidPath')

    // .then(value =>

    // console.log(value+"////////////////////////////////////////////////////////"),
    // setVideoFile(value)
    // )
    // alert(AsyncStorage.getItem('userRegistrationResponse'))

    // console.log(singleFile[0].uri + "this is video file")
    const formdata = new FormData();
    const min = 1;
    const max = 100;
    const rand = Math.round(min + Math.random() * (max - min));

    formdata.append('file', {
      uri: singleFile,

      type: 'video/mp4',
      name: videoname,
    });
    formdata.append('user_Id', userId);
    formdata.append('lang', lat);
    formdata.append('long', long);
    console.log(formdata);

    fetch(mainBaseUrl + '/detection/', {
      method: 'POST',
      body: formdata,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Arrived to send request next');
        console.log(response);
        setModalVisibility(true);
        // navigation.navigate('ProfileScreen');
        // _getUserTree();
      })
      .catch(console.log('ISSUES !'));

    // setTimeout(_getUserTree(),1000*3)

    // navigation.navigate('DetectionScreen')
  };
  const _getUserTree = () => {
    console.log('came inside the 2nd method');
    axios({
      headers: {
        // 'Authorization': 'Bearer ' + tokenValue,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
      url: mainBaseUrl + '/user/' + userId,
    })
      .then(response => {
        JSON.stringify(response);

        setSnakeDetections(response.data.User.snakeDetections);
        console.log(response.data.User.snakeDetections);
        var length = response.data.User.snakeDetections.length;
        console.log(
          length + '  this is length-------------------------------------',
        );
        console.log(response.data.User.snakeDetections[length - 1].FinalLabel);
        console.log(response.data.User.snakeDetections[length - 1].FinalScore);
        navigation.navigate('DetectionScreen', {
          FinalLabel1: response.data.User.snakeDetections[0].FinalLabel,
          FinalScore1: response.data.User.snakeDetections[0].FinalScore,
        });
      })

      .catch(function (error) {
        alert(error);
        console.log('error is ' + error);
      });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAudioPermissionStatus}) => {
          if (status !== 'READY') return <PendingView />;

          return (
            <View
              style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}
                onLongPress={() => recordVideo(camera)}
                onPressOut={() => stopVideoRecording(camera)}>
                <Text style={{fontSize: 14, color: 'white'}}> Tap </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={selectFile} style={styles.upload}>
                <Text style={{fontSize: 14, color: 'black'}}> Select </Text>
              </TouchableOpacity>

              {/* MODAL CAM success------------------------------------------------------------------------------------------------------------------- */}
              <Modal
                style={{flex: 1}}
                transparent={true}
                visible={isModalVisible}>
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
                        height: 280,
                      }}>
                      <TouchableOpacity
                        onPress={() => setModalVisibility(false)}>
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
                            color: COLORS.primary,
                            fontWeight: 'bold',
                          }}>
                          INFO
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                            Your video is submitted for
                          </Text>
                          <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                            identification.Check your profile shortly
                          </Text>
                          <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                            for the results.
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={{flex: 1, padding: 5}}>
                          <TouchableOpacity
                            style={styles.signIn}
                            // onPress={() => {loginHandle( data.username, data.password )}}

                            onPress={() => setModalVisibility(false)}>
                            <LinearGradient
                              colors={[COLORS.primary, COLORS.primary]}
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
                        {/* <View style={{ flex: 1 }}> */}
                        {/* <TouchableOpacity
                            style={styles.signIn}
                            // onPress={() => {loginHandle( data.username, data.password )}}

                            onPress={() => setModalVisibility(false)}
                          >
                            <LinearGradient
                              colors={[COLORS.primary, COLORS.primary]}
                              style={styles.signIn}
                            >
                              <Text style={[styles.textSign, {
                                color: '#fff'
                              }]}>Continue Offline</Text>
                            </LinearGradient>
                          </TouchableOpacity> */}

                        {/* </View> */}
                      </View>
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
                          backgroundColor: COLORS.primary,
                          borderRadius: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => setModalVisibility(false)}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {/* <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>OK</Text> */}
                          <FontAwesome
                            name="info-circle"
                            color={COLORS.white}
                            size={70}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* MODAL CAM success------------------------------------------------------------------------------------------------------------------- */}
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};
export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    height: 80,
    width: 80,
    margin: 20,
  },
  upload: {
    flex: 0,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 80,
    margin: 20,
  },
  recordIndicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: '#ff0000',
    marginHorizontal: 5,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
