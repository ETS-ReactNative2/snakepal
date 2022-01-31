import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Image} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import {SecondaryButton} from '../components/Button';
import {Card, ListItem, Button, Icon} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PrimaryButton} from '../components/Button';
import {SecondaryButtontwo} from '../components/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetectionDetails = ({navigation, route}) => {
  const {un} = route.params;
  const {phone} = route.params;
  const {fname} = route.params;
  const {lname} = route.params;

  const {_id} = route.params;
  const {user_Id} = route.params;
  const {lang} = route.params;
  const {long} = route.params;
  const {videoURL} = route.params;
  const {createdAt} = route.params;
  const {updatedAt} = route.params;
  const {HeadLabel} = route.params;
  const {HeadScore} = route.params;
  const {TailLabel} = route.params;
  const {TailScore} = route.params;
  const {BodyLabel} = route.params;
  const {BodyScore} = route.params;
  const {FinalScore} = route.params;
  const {FinalLabel} = route.params;

  const [lat, setlat] = useState(lang);
  const [lon, setlon] = useState(long);

  const [pagePostId, setPagePostId] = useState('');
  const [FBResult, setFBResult] = useState('');
  const [commentSet, setCommentSet] = useState([]);
  const [currentPosition, setcurrentPosition] = useState(0);

  const _getManualDetections = async () => {
    console.log('comes inside');
    let fbbody = JSON.stringify({
      videoPath: videoURL,
      AUTH_TOKEN:
        'EAA3ikgBVPJ0BAEvBhq5mZBZCrZAEdgKAJSOnrDEfZBS7PnuaODUZA4of17gcmaZCPUusCcwQ1jhB0IqLOcKAqKks8ePtmmQoVFKH7Mav0QI3yxxZB0Emid7EMElMnnQN8ZAybTGNZBZBvKwenyVr9HPVyAzAmdC4VZB3qhYYOJAJJib30SM3NurrsNc',
    });

    // await fetch('http://34.125.192.137:8080/sendFacebookPost', {
    //   method: 'POST',
    //   body: fbbody,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //     setPagePostId(responseJson.id)
    //     console.log("this is res> ",responseJson.id)

    //     alert("sent ok",pagePostId)
    //   })
    //   .catch(console.log('ISSUES !'));

    await axios({
      headers: {
        // 'Authorization': 'Bearer ' + tokenValue,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: 'http://34.125.192.137:8080/sendFacebookPost',
      data: fbbody,
    })
      .then(response => {
        setPagePostId(response.data.id);
        // setData({
        //     ...data,

        //     userResponse: response.data
        // })
        console.log(response.data);
        alert('Video sent to Facebook')
      })

      .catch(function (error) {
        alert(error);
        console.log('error is ' + error);
      });
  };

  const _getComments = async () => {
    let commentbody = JSON.stringify({
      pagePostID: pagePostId,
      AUTH_TOKEN:
        'EAA3ikgBVPJ0BAEvBhq5mZBZCrZAEdgKAJSOnrDEfZBS7PnuaODUZA4of17gcmaZCPUusCcwQ1jhB0IqLOcKAqKks8ePtmmQoVFKH7Mav0QI3yxxZB0Emid7EMElMnnQN8ZAybTGNZBZBvKwenyVr9HPVyAzAmdC4VZB3qhYYOJAJJib30SM3NurrsNc',
    });
    console.log('this is req body>', commentbody);
    await fetch('http://34.125.192.137:8080/getFacebookComments', {
      method: 'POST',
      body: commentbody,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log('this is res> ', response.comments);

        // alert('sent ok', responseJson.comments);
        setCommentSet(response.comments);
        alert('Get Comments Successfull')
      })
      .catch(console.log('ISSUES !'));
  };
  const _getResult = async () => {
    const array = commentSet;
    console.log('this is array', array);

    let sen = '';
    for (let i = 0; i < commentSet.length; i++) {
      sen += commentSet[i].message + ' ';
    }
    let sentenceBody = JSON.stringify({
      sentence: sen,
    });

    console.log('this is sentense body>', sentenceBody);
    await fetch('http://34.125.192.137:8080/getManualFacebookDetection', {
      method: 'POST',
      body: sentenceBody,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('this is res> ', responseJson.result);
        setFBResult(responseJson.result);
        //   alert("sent ok",responseJson.result)
      })
      .catch(console.log('ISSUES !'));

    // _go();
  };
  const _go = () => {
    alert('thisi s>', FBResult);
  };
  const navigateToMapView = () => {
    console.log('this is lat >', lat);
    console.log('this is long >', lon);
    if (lat != null && lon != null) {
      AsyncStorage.setItem('addedLabel', JSON.stringify(FinalLabel));
      AsyncStorage.setItem('addedLat', JSON.stringify(lat));
      AsyncStorage.setItem('addedLon', JSON.stringify(lon));
      navigation.navigate('MapScreen');
    } else {
      alert('No Location Details!');
    }
  };

  const _notifyRescurers = async () => {
    console.log('comes inside');
    let reqbody = JSON.stringify({
      detection_Id: _id,
      Final_Label: FinalLabel,
      User_FirstName: fname,
      User_LastName: lname,
      User_name: un,
      User_PhoneNo: phone,
      User_longitude: long,
      User_latitude: lang,
    });
    console.log('this is req body>', reqbody);

    await fetch('http://34.125.192.137:8080/Detection/Final_result', {
      method: 'POST',
      body: reqbody,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        // setReqRes(responseJson.responseCode);
        console.log('this is res code> ', response);
        alert('Nearest rescuer is notified')
        // if (responseJson.responseCode == 200) {
        //   setModalVisibility(true);
        //   setTimeout(() => {
        //     setModalVisibility(false);
        //   }, 2000);
        // }
      })
      .catch(console.log('ISSUES !'));

    _sendnoti();
  };

  const _sendnoti = async () => {
    await fetch('http://34.125.192.137:8080/Rescuer/SendNotifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        // setReqRes(responseJson.responseCode);
        console.log('this is res code> ', response);

        // if (responseJson.responseCode == 200) {
        //   setModalVisibility(true);
        //   setTimeout(() => {
        //     setModalVisibility(false);
        //   }, 2000);
        // }
      })
      .catch(console.log('ISSUES !'));
  };

  let res = FinalLabel == 'NONE' ? 'Unidentified' : FinalLabel;
  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Back to Profile</Text>
      </View>

      <Card>
        <Card.Title>Detection Details </Card.Title>
        <Card.Divider />
        <Card.Image
          source={
            FinalLabel == 'Cobra'
              ? require('../../assets/cobra.png')
              : FinalLabel == "Russell's Viper"
              ? require('../../assets/viper.png')
              : require('../../assets/updatedlogo.png')
          }
          style={{height: 150, width: 150, left: 80, right: 80}}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{res}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>
            {Math.round(FinalScore)}%
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginTop: 20}}>
            Head Identification as {HeadLabel} with {Math.round(HeadScore)}%
          </Text>
          <Text>
            Body Identification as {BodyLabel} with {Math.round(BodyScore)}%
          </Text>
          <Text style={{marginBottom: 20}}>
            Tail Identification as {TailLabel} with {Math.round(TailScore)}%
            {/* {videoURL} */}
          </Text>
        </View>
        <View style={{marginBottom: 20}}>
          <PrimaryButton
            title="View on Map"
            onPress={() => navigateToMapView()}
          />
        </View>

        <PrimaryButton
          title="Notify Rescue Teams"
          onPress={() => _notifyRescurers()}
        />
        <Text></Text>
        <SecondaryButtontwo
          title="Send for Manual Detections"
          onPress={() => _getManualDetections()}
        />
<View style={{justifyContent:'center',alignItems:'center'}}>
<TouchableOpacity onPress={() => _getComments()}>
          <Text style={{color: COLORS.secondary}}>Get Comments here</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _getResult()}>
          <Text style={{color: COLORS.secondary}}>Analyse Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert(FBResult)}>
          <Text style={{color: COLORS.secondary}}>Get Result</Text>
        </TouchableOpacity>
  </View>
       
      </Card>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default DetectionDetails;
