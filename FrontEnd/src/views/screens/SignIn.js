import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ImageBackground,
  Dimensions,
  Modal,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme} from 'react-native-paper';
import COLORS from '../../consts/colors';

let screenwidth = Dimensions.get('window').width;
let screeheight = Dimensions.get('window').height;

import {useNavigation} from '@react-navigation/native';
import {mainBaseUrl} from '../../../properties/UrlProperties';

import axios from 'axios';

// import { AuthContext } from '../components/context';

// import Users from '../model/users';

const SignIn = ({}) => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    //  isModalVisible:false,
    userResponse: '',
  });

  const [userData, setUserData] = useState('');
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isFailedModalVisible, setFaliedModalVisibility] = useState(false);

  const {colors} = useTheme();

  // const { signIn } = React.useContext(AuthContext);

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = () => {
    // const foundUser = Users.filter( item => {
    //     return userName == item.username && password == item.password;
    // } );

    // if ( data.username.length == 0 || data.password.length == 0 ) {
    //     Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
    //         {text: 'Okay'}
    //     ]);
    //     return;
    // }

    // if ( foundUser.length == 0 ) {
    //     Alert.alert('Invalid User!', 'Username or password is incorrect.', [
    //         {text: 'Okay'}
    //     ]);
    //     return;
    // }
    // signIn(foundUser);

    console.log('login Button clicked!');
    console.log('username: ' + data.username);
    console.log('password: ' + data.password);

    let userCreateBody = JSON.stringify({
      username: data.username,
      password: data.password,
    });

    axios({
      headers: {
        // 'Authorization': 'Bearer ' + tokenValue,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      url: mainBaseUrl + '/user/validate',
      data: userCreateBody,
    })
      .then(response => {
        setData({
          ...data,

          userResponse: response.data,
        });
        console.log(response.data);
        try {
          if (response.data.Info.username == data.username) {
            setModalVisibility(true);
            AsyncStorage.setItem(
              'userRegistrationResponse',
              JSON.stringify(response.data),
            );
          } else {
            setFaliedModalVisibility(true);
          }
        } catch {
          setFaliedModalVisibility(true);
        }
      })

      .catch(function (error) {
        alert(error);
        console.log('error is ' + error);
      });
  };

  const navigateToHome = () => {};
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/signinbackground.jpg')}
        style={{
          height: screeheight,
          width: screenwidth,
          borderRadius: 25,
          flex: 1,
        }}
      />
      <StatusBar backgroundColor="#263238" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Username
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Username"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Username must be 4 characters long.
            </Text>
          </Animatable.View>
        )}

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 8 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          <Text style={{color: '#7CB342', marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => loginHandle()}

            // onPress={() => setData({
            //     ...data,

            //     isModalVisible: true
            // })}
          >
            <LinearGradient
              colors={['#263238', '#263238']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

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
                      Awesome!
                    </Text>
                    <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                      You have successfully logged in!
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}

                    onPress={() => navigation.navigate('Home')}>
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
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
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
          <Modal
            style={{flex: 1}}
            transparent={true}
            visible={isFailedModalVisible}>
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
                  <TouchableOpacity
                    onPress={() => setFaliedModalVisibility(false)}>
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
                        color: '#ed4337',
                        fontWeight: 'bold',
                      }}>
                      Login Failed!
                    </Text>
                    <Text style={{fontSize: 14, color: '#4c4c4c'}}>
                      Incorrect username or password!
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.signIn}
                    // onPress={() => {loginHandle( data.username, data.password )}}

                    onPress={() => setFaliedModalVisibility(false)}>
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
                      backgroundColor: '#ed4337',
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setFaliedModalVisibility(false);
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
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
            onPress={() => navigation.navigate('SignUp')}
            style={[
              styles.signIn,
              {
                borderColor: '#7CB342',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#7CB342',
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RescuerLogin')}>
            <Text style={{color: '#908e8c'}}>Are you a Rescuer?</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
