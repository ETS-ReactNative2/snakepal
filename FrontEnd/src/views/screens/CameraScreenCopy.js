'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View,ToastAndroid,Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../consts/colors';
import axios from 'axios';
import { mainBaseUrl } from '../../../properties/UrlProperties';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);


class CameraScreen extends Component{

  constructor(props) {
    super(props);
    this.state = {

      isModalVisible:true,
      updatedtree:true,
      videoFile:'',
      userId:'',
      snakeDetections:[],
      long:'',
      lat:''
    };
  }
//   const [isModalVisible, setModalVisibility] = useState(true);
//   const [updatedtree, setTree] = useState(true);
  
//   const [videoFile, setVideoFile] = useState('');
//   const [userId, setUserID] = useState('');
// const[snakeDetections,setSnakeDetections]= useState([]);

// const[track,setTack]=useState('');

// const [long, setlong] = useState();
// const [lat, setlat] = useState();
//   useEffect(() => {
 

//     AsyncStorage.getItem('userRegistrationResponse')
//     .then((value) =>
//         setUserID( JSON.parse(value).Info.id),
//         // alert(userId)
//     )
//     AsyncStorage.getItem('userLocation')
//     .then((value) =>
//       setlong( JSON.parse(value).longitude),
//     )
//     AsyncStorage.getItem('userLocation')
//       .then((value) =>
//       setlat( JSON.parse(value).latitude),
//       )
//     console.log("lat: "+lat+ "   long: "+long)
    
//     if(track=='done'){

//     }

// })
componentDidMount(){
       AsyncStorage.getItem('userRegistrationResponse')
      .then((value) =>
      this.setState({
        userId:JSON.parse(value).Info.id
      },() => {
        console.log("New state in ASYNC callback:", this.state.userId);
    }),
    console.log("New state DIRECTLY after setState:", this.state.userId),
    console.log("New state DIRECTLY after setState:", this.state.userId)
        
      )

      AsyncStorage.getItem('userLocation')
      .then((value) =>
        this.setState({
          long:JSON.parse(value).longitude
        },() => {
          console.log("New state in ASYNC callback:", this.state.long);
      }),
      console.log("New state DIRECTLY after setState:", this.state.long),
      console.log("New state DIRECTLY after setState:", this.state.long)
          
        
      )
      AsyncStorage.getItem('userLocation')
        .then((value) =>
        this.setState({
          lat:JSON.parse(value).latitude
        },() => {
          console.log("New state in ASYNC callback:", this.state.lat);
      }),
      console.log("New state DIRECTLY after setState:", this.state.lat),
      console.log("New state DIRECTLY after setState:", this.state.lat)
          
        
        )
      console.log("lat: "+this.state.lat+ "   long: "+this.state.long)
      
}





takePicture = async function(camera) {

  
  const options = { quality: 0.5, base64: true };
  const data = await camera.takePictureAsync(options);
  console.log(data.uri);
};
 recordVideo = async function(camera) {

  ToastAndroid.showWithGravityAndOffset(
    "Recording...",
    ToastAndroid.LONG,
    ToastAndroid.TOP,
    25,
    50
  );
  const options = { quality: 0.5, base64: true };
  const video = await camera.recordAsync(options);
console.log(video.uri+"this is from camera")
  // setVideoFile(video.uri);
  // setVideoFile( video.uri)
  this.setState({
    videoFile:video.uri
  },() => {
    console.log("New state in ASYNC callback:", this.state.videoFile);
}),
console.log("New state DIRECTLY after setState:", this.state.videoFile),
console.log("New state DIRECTLY after setState:", this.state.videoFile)
    
  
  

  alert("this is firset set : "+this.state.videoFile )
  this._setvidpath(video.uri)

  
  const path = video.uri;
  // const jsonValue = JSON.stringify(path)
 
  // if(jsonValue!=null){
    AsyncStorage.setItem('newVidPath',path);
    alert(this.state.videoFile +"this is setting to async storage")

  // }
 

};
 _setvidpath =(vid)=>{
  this.setState({
    videoFile:vid
  })

    alert("this is second set "+this.state.videoFile)
}
stopVideoRecording = async function(camera) {

  camera.stopRecording();
this._sendVideoforDetection();

};
vivt =(val)=>{
  console.log("came inside viv")
  alert(val+"from vivasasasasat")
}

 _sendVideoforDetection = ()=>{
//  var date = new Date();
//  console.log("this is date"+date)
//  console.log("this is state va; "+this.state.userId)

AsyncStorage.getItem('newVidPath').then(code => {
  console.log(code.toString()+ " reddaaaaaaa")
  this.setState({videoFile:code.toString()})
  const viv = code.toString()
  this.vivt(code.toString())// or code.toString().. depends on what you stored
});


// alert(viv+"menna mekaaaaax")
  // AsyncStorage.getItem('newVidPath')

  // .then(value =>

  // console.log(value+"////////////////////////////////////////////////////////"),
  // setVideoFile(value)
  // )
  // alert(AsyncStorage.getItem('userRegistrationResponse'))
  



  console.log(this.state.videoFile + "this is video file all set to go")
  const formdata = new FormData();
  const min = 1;
  const max = 100;
  const rand = Math.round(min + Math.random() * (max - min));
  formdata.append("file", {
    
    uri:this.state.videoFile,

 
  type: 'video/mp4',
  name: 'newvid'

  });
  formdata.append('user_Id',this.state.userId);
  formdata.append('lang',this.state.lat);
  formdata.append('long',this.state.long);
  console.log(formdata)


            fetch(mainBaseUrl+'/detection/',{
  method: 'POST',
  body:formdata,
  headers: {
    "Content-Type": "multipart/form-data,application/json;charset=UTF-8",
    'Accept': 'application/json',
    // 'Content-Type': 'application/json',
  }
}).then(response => {
      console.log("Arrived to send request next")
      console.log(response.json())
      console.log("that's it")
      // if(response.data.FinalScore!=0){
      //   navigation.navigate('DetectionScreen', {
      //     FinalLabel1: response.data.FinalLabel,
      //     FinalScore1: response.data.FinalScore,
      //   });
    

      // }


      
 
     })
            .catch((console.log("ISSUES !")))


}
 _getUserTree =()=>{
  console.log("came inside the 2nd method")
  axios({
    headers: {
      // 'Authorization': 'Bearer ' + tokenValue,
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'GET',
    url: mainBaseUrl+"/user/"+userId,
  
  })
    .then(response => {
      JSON.stringify(response)
  
      setSnakeDetections(response.data.User.snakeDetections)
   console.log(response.data.User.snakeDetections)
    var length = response.data.User.snakeDetections.length
    console.log(length+"  this is length-------------------------------------")
      console.log(response.data.User.snakeDetections[0].FinalLabel)
      console.log(response.data.User.snakeDetections[0].FinalScore)
      navigation.navigate('DetectionScreen', {
        FinalLabel1: response.data.User.snakeDetections[0].FinalLabel,
        FinalScore1: response.data.User.snakeDetections[0].FinalScore,
      });
  
    })
  
    .catch(
      function (error) {
        alert(error)
        console.log("error is " + error);
      }
    )
      
  

  

}
render() {
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
          }}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
           
            
            return (
              
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center',alignItems:'center' }}>
                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}
                  onLongPress={() => this.recordVideo(camera)} 
                  onPressOut={() => this.stopVideoRecording(camera)} >
                  <Text style={{ fontSize: 14,color:'white' }}> Tap </Text>
                </TouchableOpacity>



{/* MODAL CAM success------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={this.state.isModalVisible}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 ,height:280}}>
                                                <TouchableOpacity
                                                      onPress={() => this.setState({
                                                        isModalVisible:false
                                                      })}
                                                >
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <View style={{ flex: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222222' }}></Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text >X</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <View
                                                    style={{
                                                        borderBottomColor: '#d3d3d3',
                                                        borderBottomWidth: 1,
                                                        padding: 10
                                                    }}
                                                ></View>
                                                <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 5, marginBottom: 30 }}>
                                                    {/* <Image
                                                        style={{ width: 60, height: 60 }}
                                                        source={require('../assets/warning.gif')}
                                                    /> */}
                                                    <Text style={{ fontSize: 24, marginTop: 10, color:COLORS.primary,fontWeight:'bold' }}>Choose an option</Text>
                                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                                                    <Text style={{ fontSize: 14, color: '#4c4c4c' }}>SankePal allows you to identify snakes offline as well as online, select your preferred method to continue.</Text>
                                                    </View>
                            
                                                  

                               
                                                </View>

                                                <View style={{flexDirection:'row',flex:1,justifyContent:'center',alignItems:'center'}}>
                                                  <View style={{flex:1,padding:5}}>
                                                  <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => this.setState({
                      isModalVisible:false
                    })}
                >
                <LinearGradient
                    colors={[COLORS.primary,COLORS.primary]}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Continue Online</Text>
                </LinearGradient>
                </TouchableOpacity>

                                                  </View>
                                                  <View style={{flex:1}}>
                                                  <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => this.setState({
                      isModalVisible:false
                    })}
                >
                <LinearGradient
                    colors={[COLORS.primary,COLORS.primary]}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Continue Offline</Text>
                </LinearGradient>
                </TouchableOpacity>

                                                  </View>

                                                </View>
                                  
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:COLORS.primary, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                onPress={() => this.setState({
                                                  isModalVisible:false
                                                })}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
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
  

        }
}
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
  alignItems:'center',
  justifyContent:'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    height:80,width:80,
    margin: 20,
    
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
},
});

