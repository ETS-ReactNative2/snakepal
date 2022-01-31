import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../consts/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import {PermissionsAndroid} from 'react-native';
import {mainBaseUrl} from '../../../properties/UrlProperties';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {PrimaryButton} from '../components/Button';
import {flaskBaseUrl} from '../../../properties/UrlProperties';
import {fbAuthToken} from '../../../properties/UrlProperties';
import {CardViewWithImage, CardView} from 'react-native-simple-card-view';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

const ProfileScreen = ({navigation}) => {
  const [userTree, setUserTree] = useState([]);
  const [userfname, setUserfname] = useState();
  const [userlname, setUserlname] = useState();
  const [username, setUsername] = useState();
  const [useremail, setUseremail] = useState();
  const [userphone, setUserphone] = useState();
  const [showFBresult, setFBresult] = useState(false);

  const [pagepostID, setpagepostID] = useState();
  const [commentList, setcommentList] = useState();
  const [userId, setUserId] = useState();
  const [snakedetections, setDetectoins] = useState([]);

  const [long, setlong] = useState();
  const [lat, setlat] = useState();
  const [useraddress, setuseraddress] = useState();
  const [noofDetections, setNoOfDetections] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('userRegistrationResponse').then(value =>
      setUserTree(JSON.parse(value).User.successDetections),
    );
    // alert(userTree[0])

    AsyncStorage.getItem('userRegistrationResponse').then(value =>
      setUsername(JSON.parse(value).User.username),
    ),
      AsyncStorage.getItem('userRegistrationResponse').then(value =>
        setUserfname(JSON.parse(value).User.firstname),
      ),
      AsyncStorage.getItem('userRegistrationResponse').then(value =>
        setUserlname(JSON.parse(value).User.lastname),
      ),
      AsyncStorage.getItem('userRegistrationResponse').then(value =>
        setUseremail(JSON.parse(value).User.email),
      ),
      AsyncStorage.getItem('userRegistrationResponse').then(value =>
        setUserphone(JSON.parse(value).User.phoneNo),
      ),
      AsyncStorage.getItem('userRegistrationResponse').then(value =>
        setNoOfDetections(JSON.parse(value).User.successDetections.length),
      ),
      // AsyncStorage.getItem('userLocation')
      // .then((value) =>
      //   setlong( JSON.parse(value).longitude),
      // ),
      // AsyncStorage.getItem('userLocation')
      //   .then((value) =>
      //   setlat( JSON.parse(value).latitude),
      //   ),
      // console.log("lat: "+lat+ "   long: "+long)

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
  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

  const _getUserTree = () => {
    axios({
      headers: {
        // 'Authorization': 'Bearer ' + tokenValue,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
      url: mainBaseUrl + '/user/' + userId,
    })
      .then(response => {
        setDetectoins(response.data.User.snakeDetections);
        console.log(response.data.User.snakeDetections);
      })

      .catch(function (error) {
        alert(error);
        console.log('error is ' + error);
      });
  };

  const _setNavigate = item => {
    console.log(item.createdAt);
    navigation.navigate('DetectionDetails', {
      un: username,
      phone: userphone,
      fname: userfname,
      lname: userlname,
      _id: item._id,
      user_Id: item.user_Id,
      lang: item.lang,
      long: item.long,
      videoURL: item.videoURL,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      HeadLabel: item.HeadLabel,
      HeadScore: item.HeadScore,
      TailLabel: item.TailLabel,
      TailScore: item.TailScore,
      BodyLabel: item.BodyLabel,
      BodyScore: item.BodyScore,
      FinalScore: item.FinalScore,
      FinalLabel: item.FinalLabel,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleBar}>
          <View style={styles.header}>
            <FontAwesome
              name="chevron-left"
              size={28}
              onPress={() => navigation.goBack()}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}> Back</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RescuerNotifications')}>
              <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 180}}>
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
            {/* <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons> */}
            <FontAwesome name="check-circle-o" size={20} color="#DFD8C8" />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, {fontWeight: '200', fontSize: 25}]}>
            {userfname} {userlname}
          </Text>
          <Text style={[styles.text, {color: '#AEB5BC', fontSize: 14}]}>
            {username}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, {fontSize: 24}]}>{noofDetections}</Text>
            <Text style={[styles.text, styles.subText]}>Detections</Text>
          </View>
          <View
            style={[
              styles.statsBox,
              {borderColor: '#DFD8C8', borderLeftWidth: 1, borderRightWidth: 1},
            ]}>
            <Text style={[styles.text, {fontSize: 18}]}>{userphone}</Text>
            <Text style={[styles.text, styles.subText]}>Mobile</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, {fontSize: 12}]}>long - {long}</Text>
            <Text style={[styles.text, {fontSize: 12}]}>
              lati - {lat}
              {useraddress}
            </Text>
            <Text style={[styles.text, styles.subText]}>Current Location</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#DFD8C8',
            borderBottomWidth: 1,
            marginTop: 5,
          }}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              marginTop: 10,
              fontWeight: 'bold',
              color: '#7CB342',
            }}>
            List of Detections
          </Text>
          <Text>Click on the card to view more</Text>
        </View>

        <View style={{marginTop: 10}}>
          <ScrollView showsHorizontalScrollIndicator={true}>
            {userTree.map((item, index) => (
              <View
                key={index}
                style={{marginLeft: 20, marginTop: 10, marginRight: 20}}>
                <Card key={index}>
                  <Card.Content
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Title>{item.FinalLabel}</Title>
                    <Paragraph>With an accuracy of</Paragraph>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#7CB342',
                      }}>
                      {Math.round(item.FinalScore)}%
                    </Text>
                  </Card.Content>
                  <Card.Cover
                    resizeMode={`contain`}
                    style={{
                      flexDirection: 'column',
                      height:
                        Image.resolveAssetSource(
                          require('../../assets/viper.png'),
                        ).height / 2,
                      // width:Image.resolveAssetSource(require("../../assets/cobra.png")).width/4+20
                    }}
                    source={
                      item.FinalLabel == 'Cobra'
                        ? require('../../assets/cobra.png')
                        : item.FinalLabel == "Russell's Viper"
                        ? require('../../assets/viper.png')
                        : require('../../assets/updatedlogo.png')
                    }
                  />
                  <Card.Actions>
                    <Button
                      //  mode="contained"
                      color="#7CB342"
                      onPress={() => _setNavigate(item)}>
                      More Info
                    </Button>
                  </Card.Actions>
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{flexDirection: 'row', marginHorizontal: 50}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProfileScreen;

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
    marginTop: 32,
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
});
