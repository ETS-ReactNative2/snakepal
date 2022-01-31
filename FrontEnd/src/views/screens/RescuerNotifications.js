import React, { Component } from 'react';


import { View, Text, Image,StyleSheet,TouchableOpacity,Modal } from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import COLORS from '../../consts/colors';
import {PrimaryButton} from '../components/Button';
import {SecondaryButtontwo} from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class RescuerNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {

      Modalshow:false
    };
  }

  render() {
    return (
        <View>
               
       <View style={styles.header}>
          <Icon name="arrow-back-ios" size={28} onPress={() => this.props.navigation.goBack()} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Go back</Text>
        </View>

             <Card >
        <Card.Title>Notification </Card.Title>
        <Card.Divider/>
        <Card.Image source={require('../../assets/viper.png')}
        style={{height:150,width:150,left:80,right:80}}
   />
   <View style={{justifyContent:'center',alignItems:'center'}}>
   <Text style={{fontWeight:'bold'}}>Russell's Viper</Text>
   </View>
 
          <Text style={{marginBottom: 20,marginTop:20}}>
           Faseel Nazeel is requesting you to rescue a Russel Viper he/she has detected. (Phone - 0777134744)
          </Text>
          <PrimaryButton title="View Location on Map"
          onPress={() => this.props.navigation.navigate('MapScreen')} />
          <Text></Text>
             <SecondaryButtontwo title="Accept Rescue Request"
           onPress={() => this.setState({Modalshow:true})} />
        
      </Card>



      {/* MODAL FB------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={this.state.Modalshow}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                      onPress={() => this.setState({Modalshow:false})}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color:COLORS.primary,fontWeight:'bold' }}>Thank you!</Text>
                                                    <View style={{justifyContent:'center',alignItems:'center',alignSelf:'center',alignContent:'center'}}>
                                                    <Text style={{ fontSize: 16, color: '#4c4c4c' }}>We appriciate your concern in rescuing this snake.</Text>
                                                    </View>
                            
                                                  

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => this.setState({Modalshow:false})}
                >
                <LinearGradient
                    colors={[COLORS.primary,COLORS.primary]}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>OK</Text>
                </LinearGradient>
                </TouchableOpacity>
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:COLORS.primary, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                   onPress={() => this.setState({Modalshow:false})}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                        {/* <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>OK</Text> */}
                                                        <FontAwesome 
                    name="thumbs-up"
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
       
    );
  }
}

export default RescuerNotifications;


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
   });


