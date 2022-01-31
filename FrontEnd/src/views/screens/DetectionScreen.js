
import React, { useState,useEffect } from 'react';
import { View, Text,Image,StyleSheet,Dimensions,TouchableOpacity,ImageBackground,Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PrimaryButton} from '../components/Button';
import AccuracyChart from './AccuracyChart'
import COLORS from '../../consts/colors';
import snakes from '../../consts/snakes';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView,{Marker,Callout,} from 'react-native-maps';


let screenwidth = Dimensions.get('window').width
let screeheight = Dimensions.get('window').height

let token = "EAA3ikgBVPJ0BANAjVoXRSgzKPaiEfWXzMzwFMUF96bsZBPhBTFEByzZAwa98Ws13OQtgXTzUc36ePizjqwsuZBOQPbzk66WSfKSrjoCjzm2EZAIO3LT5ygUKqrtJipWILv70dVnLeLp2yYtELZAc09uBA4k3LKxJb8Uh3hOMBupccIX8fD4YSGNGwgHQMqmw8PqZAzhAryjFpZBLI4XucBc";
let pid = 101972902051639;
let imageUrl = 'https://www.srilankansafari.com/images/wildlife-of-sri-lanka/reptiles-sri-lanka/sri-lankan-russells-viper/russells-viper01.jpg';

const DetectionScreen  =({ route, navigation })=> {

    const { FinalLabel1 } = route.params;
    const { FinalScore1 } = route.params;
   
    const [showFBModal, setFBModal] = useState(false);
    const [showrescueModal, setRescueModal] = useState(false);
    const [showFBresult, setFBresult] = useState(false);

    const [FinalScore, setFinalScore] = useState([]);
    const [FinalLabel, setFinalLabel] = useState([]);
    const [arraySize, setSize] = useState([]);

    const [long, setlong] = useState();
    const [lat, setlat] = useState();
  

    useEffect(() => {
     
        AsyncStorage.getItem('userRegistrationResponse')
        .then((value) =>
    
        setFinalScore( JSON.parse(value).Info.id),
        )

        AsyncStorage.getItem('userLocation')
        .then((value) =>
          setlong( JSON.parse(value).longitude),
        )
        AsyncStorage.getItem('userLocation')
          .then((value) =>
          setlat( JSON.parse(value).latitude),
          )
        console.log("lat: "+lat+ "   long: "+long)
    
        //   AsyncStorage.getItem('userRegistrationResponse')
        // .then((value) =>
    
        // setFinalScore( JSON.parse(value).User.snakeDetections[arraySize-1].FinalScore),
        // )

      
        // AsyncStorage.getItem('userRegistrationResponse')
        // .then((value) =>
    
        // setFinalLabel( JSON.parse(value).User.snakeDetections[arraySize-1].FinalScore),
        // )
        // // alert(userTree[0])
       


  })

const data = [{
    percentage: FinalScore1,
    color:COLORS.secondary,
    max: 100
  }]

//   constructor(props) {
//     super(props);
//     this.state = {
//         commentRes:[],
//         postResponse:'',
//         Path:'xsx',

//         generatedPostId:'',
//         che:'',
//         postUpdateResponse:'',

//         showFBModal:false,
//         showrescueModal:false,

//         fbresultModal:false

//     };
//   }

  // componentDidMount(){
  //   alert(this.state.Path)
  // }

//   const getComments = () => {
//    alert(this.state.postResponse)
//    console.log(this.state.postResponse + "this is the page post id")
//    const val = this.state.postResponse

   
//     axios({
//         headers: {
            
//             'Content-Type': 'application/json;charset=UTF-8',
//         },

//         method: 'GET',
//         url: 'https://graph.facebook.com/'+val+'?fields=id,from,message,comments.summary(true)&access_token='+token,
 
        
//     })
//         .then(response => {
//             console.log("Arrived to send request")
//             this.setState({
//                 commentRes: response.data.comments.data
//             })
//             console.log(this.state.commentRes)

//         })
     
//         .catch((console.log("ISSUES in get comments  !")))

// }
// const commentlist = () =>{
    
//     return this.state.commentRes.map((comment) => {

//         return (
//           <View style={{marginTop:20,justifyContent:'center',alignItems:'center'}}>
//           <Text style={{fontSize:20,fontWeight:'bold'}}> Manual Detections </Text>
         
//           <View  key={comment.id}>
//               <Text style={{fontSize:15}}>{comment.message} - Endorsed by {comment.from.name}</Text>
//           </View>
//           </View>
//         );
//     });
// }
//  const getData = async () => {
//     try {
//       const value = await AsyncStorage.getItem('userImagePath')
//       if(value !== null) {
//         // alert(value)
//         this.setState({Path:value})
//         console.log("path is "+this.state.Path)
      
//       }
//     } catch(e) {
//       // error reading value
//     }
//   }


// const sendFBPost = () => {

//    const go =  'https://graph.facebook.com/'+pid+'/photos?url='+imageUrl+'&access_token='+token
//    const up =  'https://graph.facebook.com/v11.0/'+this.state.postResponse+'message="Kindly Provide the Identification!'+'&access_token='+token
//         axios.post(go)
//         .then(res => {
//           console.log(res);
//           console.log(res.data);
//           this.setState({
//             postResponse: res.data.post_id
//         })
        
//         alert("Post sent to the manual detections. You will be notified with the detection shorty.")
//         try {
//            AsyncStorage.setItem('fbpagepostid', this.state.postResponse)
//         } catch (e) {
//           console.log("error in setting the image path")
//         }
//         this.setState({
//           generatedPostId:res.data.post_id
//         })
      
//         })
        


       
  
//         setTimeout(this.updatePost,
//           10000
//       )
     

      

// }
// const updatePost=()=>{

//   const up =  'https://graph.facebook.com/'+this.state.postResponse+'?message=Kindly Provide the Identification!'+'&access_token='+token
//   axios.post(up).then(res=>{
//         console.log(res.data)
//       })
// }

{





    return (
      <View style={{flex:1}}>
      
        {/* <View style={styles.container}>
      
            <View style={{width:250 ,}}>
            <PrimaryButton  title="get photo" onPress={this.getData}/>
            </View>

            <View style={{width:250 ,marginTop:10}}>
            <PrimaryButton  title="Send for manual detections" onPress={this.sendFBPost}/>
            </View>
            <View style={{width:250 ,marginTop:10}}>
            <PrimaryButton  title="Get Comments" onPress={this.getComments}/>



            </View>
    
            <View >{this.commentlist()}</View>
            <Image source={{ uri: this.state.Path }} style={{width:180,height:180}} />
         

       </View> */}
       <View style={{flex:1}}>
         
       <View style={styles.header}>
          <Icon name="arrow-back-ios" size={28} onPress={() =>navigation.goBack()} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Go back</Text>
        </View>

        <View style={{flex:3}}>
        



        <View style={{
                                flex: 1, backgroundColor: '#ffffff', marginLeft: 20, borderRadius: 20,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                                width: screenwidth - 35, marginTop: 5

                            }}>

                              <View style={{alignItems:'center',marginTop:10}}> 
                              <TouchableOpacity onPress={() =>setFBresult(true)}>
                              <Text style={styles.text_header}>Your Detection</Text>
                              </TouchableOpacity>
                             

                              </View>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center' ,marginTop:10}}>
                                            {data.map((p, i) => {
                                                return <AccuracyChart key={i} percentage={p.percentage} color={p.color} delay={500 + 100 * i} max={p.max} />
                                            })}
                                        </View>
                                        <View style={{alignItems:'center',marginTop:10}}> 
                              <Text style={{fontSize:16}}>The specie is</Text><Text style={{fontSize:20,color:COLORS.dark,fontWeight:'bold'}}>{FinalLabel1}</Text>
                              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                              <Text style={{fontSize:16}}>Identified with an accuracy of</Text>
                              <Text style={{fontSize:20,color:COLORS.primary,fontWeight:'bold'}}> {Math.round(FinalScore1)}%</Text>
                              </View>

                              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                              <Text style={{fontSize:16}}>This specie is</Text>
                              <Text style={{fontSize:20,color:'red',fontWeight:'bold'}}> {FinalLabel1 == "Russell's Viper"||"Cobra" ? 'Highly Venomous': 'NON'}</Text>
                              </View>
                             

                              </View>
                               
                            </View>
                            



    
        

        </View>
        <View style={{flex:2}}>
        <View style={{
                                flex: 1, backgroundColor: '#ffffff', marginLeft: 20, borderRadius: 20,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                                width: screenwidth - 35, marginTop: 5,marginBottom:20

                            }}>

                              <View style={{flexDirection:'row'}}>
                                {/* <Image
                    source={snakes[1].image}
                    style={{height: 150, width: 150, resizeMode: 'cover',marginHorizontal:20,marginVertical:20}}
                    /> */}

<MapView style={styles.map}
    // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: lat,
         longitude:long,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
       <Marker
       coordinate={{
        latitude:lat,
        longitude:long,
       }}
    //    image = {require('../../assets/markernew.png')}
      
       title="Snake"
       description="sample description"
       >
         <Callout tooltip>
<View>
  <View style={styles.bubble}> 
  <Text style={styles.name}>Russel Viper</Text>
  {/* <Text style={styles.name}>sample description</Text> */}
  <Image style={styles.image}
  source = {require('../../assets/viper.png')}
  />
     
  </View>
  <View style={styles.arrowBorder}/>
  <View style={styles.arrow}/>
</View>
         </Callout>
         </Marker>
     </MapView>
                <View style={{flexDirection:'column',marginTop:60,marginLeft:20}}>
                <Text style={{fontSize:20,color:COLORS.dark,fontWeight:'bold'}}>{FinalLabel1}</Text>
                <Text style={{fontSize:16,color:COLORS.dark,fontWeight:'bold',marginTop:10}}>Scientific Name</Text>
          
                <Text style={{fontSize:16,color:COLORS.grey,fontStyle:'italic'}}>Daboia russelii</Text>
                </View>

               
                         
                             
                              </View>
                               


                              <View style={{flexDirection:'row',flex:1}}>

<View style={{flex:1,marginHorizontal:5}}>
<TouchableOpacity
    style={styles.signIn}
    // onPress={() => {loginHandle( data.username, data.password )}}
  
    onPress={() => setRescueModal(true)}
>
<LinearGradient
    colors={[COLORS.secondary,COLORS.secondary]}
    style={styles.signIn}
>
    <Text style={[styles.textSign, {
        color:'#fff'
    }]}>Notify rescue teams</Text>
</LinearGradient>
</TouchableOpacity>

</View>

<View style={{flex:1,marginHorizontal:5}}>
<TouchableOpacity
    style={styles.signIn}
    // onPress={() => {loginHandle( data.username, data.password )}}
    onPress={() => setFBModal(true)}
>
<LinearGradient
    colors={[COLORS.secondary,COLORS.secondary]}
    style={styles.signIn}
>
    <Text style={[styles.textSign, {
        color:'#fff'
    }]}>Get manual detections</Text>
</LinearGradient>
</TouchableOpacity>

</View>




{/* MODAL FB success------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={showFBModal}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                      onPress={() => setFBModal(false)}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color:'#FFDF00',fontWeight:'bold' }}>Notice!</Text>
                                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                                                    <Text style={{ fontSize: 14, color: '#4c4c4c' }}>Your video will be sent to a snake converstional page on Facebook and you will be notified with the manual detections by snake experts shortly</Text>
                                                    </View>
                            
                                                  

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => setFBModal(false)}
                >
                <LinearGradient
                    colors={['#FFDF00','#FFDF00']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>OK</Text>
                </LinearGradient>
                </TouchableOpacity>
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:'#FFDF00', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                 onPress={() => setFBModal(false)}>
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

{/* MODAL FB success------------------------------------------------------------------------------------------------------------------- */}


{/* MODAL Rescue success------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={showrescueModal}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                      onPress={() => setRescueModal(false)}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color:'#FFDF00',fontWeight:'bold' }}>Notice!</Text>
                                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                                                    <Text style={{ fontSize: 14, color: '#4c4c4c' }}>Your snake identification along with a location will be send to the nearest snake rescuer. The rescuer might contact you via mobile</Text>
                                                    </View>
                            
                                                  

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => setRescueModal(false)}
                >
                <LinearGradient
                    colors={['#FFDF00','#FFDF00']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>OK</Text>
                </LinearGradient>
                </TouchableOpacity>
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:'#FFDF00', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                  onPress={() => setRescueModal(false)}>
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

{/* MODAL Rescue success------------------------------------------------------------------------------------------------------------------- */}



                
{/* MODAL FB------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={showFBresult}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                  onPress={() =>setFBresult(false)}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color:COLORS.secondary,fontWeight:'bold' }}>Manual Identification!</Text>
                                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                                                    <Text style={{ fontSize: 18, color: '#4c4c4c',fontWeight:'bold' }}>Russell's Viper</Text>
                                                    </View>
                            
                                                  

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() =>setFBresult(false)}
                >
                <LinearGradient
                    colors={[COLORS.secondary,COLORS.secondary]}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>OK</Text>
                </LinearGradient>
                </TouchableOpacity>
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:'#4267B2', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                   onPress={() =>setFBresult(false)}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                        {/* <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>OK</Text> */}
                                                        <FontAwesome 
                    name="facebook"
                    color={COLORS.white}
                    size={70}
                />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
{/* MODAL FB------------------------------------------------------------------------------------------------------------------- */}
                
                






</View>

                            </View>



    
        

        </View>
     
         
</View>

       </View>
     
      );
    }
  }



  


export default DetectionScreen;

const styles = StyleSheet.create({
  
    header: {
      paddingVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
     
    },
    text_header: {
      color: COLORS.primary,
      fontWeight: 'bold',
      fontSize: 30
  },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
    
    container: {
 
 flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    map: {
        height: screeheight/4-20,
        width: screenwidth/2,
        marginTop:20,
        
        left:10,
        bottom:10

    
      },
   });


