import React,{useState} from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    ColorPropType,
    Image,
    ImageBackground,
    Modal
    
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../../consts/colors';
import { useNavigation } from '@react-navigation/native';


import axios from 'axios';

let screenwidth = Dimensions.get('window').width;
let screeheight = Dimensions.get('window').height;

import { mainBaseUrl } from '../../../properties/UrlProperties';

const SignUp = () => {

    const navigation = useNavigation();
    const [isModalVisible,setModalVisibility]= useState(false)
    const [isFailedModalVisible, setFaliedModalVisibility] = useState(false);

    const [data, setData] = useState({

        fname:'',
        lanme:'',
        phone:'',
        email:'',
        
        username: '',
        password: '',

        confirm_password: '',
        check_textInputChange: false,
        check_textInputChangelname: false,
        check_mobileInputChange:false,
        checkemailiInputChange:false,
        checkPasswordInputChange:false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        // isModalVisible: false,
        check_UsernameChange:false,

        userResponse:''

    });
    


    const textInputChangeUsername = (val) => {
        if( val.username !== 0 ) {
            setData({
                ...data,
                username: val,
                check_UsernameChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_UsernameChange: false
            });
        }
    }

    const textInputChangefname = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                fname: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                fname: val,
                check_textInputChange: false
            });
        }
    }

    const textInputChangelanme = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                lanme: val,
                check_textInputChangelname: true
            });
        } else {
            setData({
                ...data,
                lanme: val,
                check_textInputChangelname: false
            });
        }
     
    }
    const textInputChangephone = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                phone: val,
                check_mobileInputChange: true
            });
        } else {
            setData({
                ...data,
                phone: val,
                check_mobileInputChange: false
            });
        }
     
    }
    
    const textInputChangeEmail = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                email: val,
                checkemailiInputChange: true
            });
        } else {
            setData({
                ...data,
                email: val,
                checkemailiInputChange: false
            });
        }
     
    }
    const handlePasswordChange = (val) => {
        if( val.length !== 0 ) {
        setData({
            ...data,
            password: val
        });
    }
    else {
        setData({
            ...data,
            password: val,
            check_textInputChange: false
        });
    }
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const _callApiCreateUser =() =>{
 
        console.log("fname: "+data.fname)
        console.log("lastname: "+data.lanme)
        console.log("email: "+data.email)
        console.log("phoneNo: "+data.phone)
        console.log("password: "+data.password)
        console.log("conpass: "+data.confirm_password)
  

      
    
        let userCreateBody = JSON.stringify(
          {
            
    "username" : data.username,
    "password" : data.password,
    "conpass":data.confirm_password,
    "email" : data.email,
    "firstname":data.fname ,
    "lastname" :data.lanme ,
    "phoneNo" : data.phone
           
          }
        )

        axios({
          headers: {
            // 'Authorization': 'Bearer ' + tokenValue,
            'Content-Type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
          url: mainBaseUrl+"/user/add",
          data: userCreateBody,
        })
          .then(response => {
            console.log(JSON.stringify(response));
           setData({
                ...data,
              
                userResponse: response.data
            })
            // console.log(data.userResponse)

            if(response.data.msg == "Successfull"){
                setModalVisibility(true)
            }
            else{
                setFaliedModalVisibility(true)
            }

      
          })
    
          .catch(
            function (error) {
              alert(error)
              console.log("error is " + error);
            }
          )

    }

    return (
      <View style={{flex:1}}>
          <ImageBackground
          source={require('../../assets/signupbackground.jpg')}
          style={{height: screeheight, width: screenwidth, borderRadius: 25,flex:1}}
     
        />
       
     
          <StatusBar backgroundColor='#263238' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>


            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="SunilP"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChangeUsername(val)}
                />
                {data.check_UsernameChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>




            <Text style={styles.text_footer}>First Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Sunil"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChangefname(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Last Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Perera"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChangelanme(val)}
                />
                {data.check_textInputChangelname ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>






            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Mobile number</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="mobile"
                    color="#05375a"
                    size={40}
                />
                <TextInput 
                    placeholder="0717291782"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChangephone(val)}
                />
                {data.check_mobileInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>



            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-open-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="sunilperera@gmail.com"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChangeEmail(val)}
                />
                {data.checkemailiInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                  {data.checkPasswordInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 20
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                   onPress={()=>{_callApiCreateUser()}}
                //  onPress={() => setData({
                //     ...data,
                  
                //     isModalVisible: true
                // })
              
                //  }
                >
                <LinearGradient
                    colors={['#263238', '#263238']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign Up</Text>
                </LinearGradient>
                </TouchableOpacity>






                
{/* MODAL success------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={isModalVisible}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                     onPress={() => setModalVisibility(false)}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color: COLORS.secondary,fontWeight:'bold' }}>Awesome!</Text>
                                                    <Text style={{ fontSize: 14, color: '#4c4c4c' }}>You have successfully Registered!</Text>

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => navigation.navigate('SignIn')}
                >
                <LinearGradient
                    colors={[COLORS.secondary,COLORS.secondary]}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Done</Text>
                </LinearGradient>
                </TouchableOpacity>
                                            </View>
                                            <View style={{ position: 'absolute',top:-30, justifyContent: 'center', alignItems: 'center', left: 50, right: 50 }} >
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:COLORS.secondary, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                    onPress={() => { setModalVisibility(false) }}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
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

{/* MODAL falied------------------------------------------------------------------------------------------------------------------- */}
<Modal style={{ flex: 1 }}
                                    transparent={true}
                                    visible={isFailedModalVisible}>
                                    <View style={{ backgroundColor: "#000000aa", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 23, }}>
                                            <View style={{ backgroundColor: "#ffffff", paddingVertical: 30, borderTopColor: "black", paddingHorizontal: 30, borderRadius: 23, width: 340 }}>
                                                <TouchableOpacity
                                                     onPress={() => setFaliedModalVisibility(false)}
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
                                                    <Text style={{ fontSize: 24, marginTop: 10, color: '#ed4337',fontWeight:'bold' }}>Registration Failed!</Text>
                                                    <Text style={{ fontSize: 14, color: '#4c4c4c' }}>{data.userResponse.warn}</Text>

                               
                                                </View>
                                                <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}
                  
                    onPress={() => setFaliedModalVisibility(false)}
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
                                                <TouchableOpacity style={{ height: 100, width: 100, backgroundColor:'#ed4337', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                                    onPress={() => { setFaliedModalVisibility(false) }}>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                                        {/* <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>OK</Text> */}
                                                        <FontAwesome 
                    name="times-circle"
                    color={COLORS.white}
                    size={70}
                />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>

{/* MODAL falied------------------------------------------------------------------------------------------------------------------- */}



                <TouchableOpacity
                   onPress={() => navigation.navigate('SignIn')}
                    style={[styles.signIn, {
                        borderColor: COLORS.secondary,
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:COLORS.secondary
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
    //   backgroundColor: '#263238'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: COLORS.secondary
    }
  });