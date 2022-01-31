import { StatusBar } from "expo-status-bar";
// import React, { Component } from 'react';
import { Image, StyleSheet, Text, View ,Button} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import COLORS from '../../consts/colors';
import HomeScreen from '../navigation/BottomNavigator'
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SignUp from "./SignUp";


const OnBoardScreen = ({navigation}) => {
  const [isDone, setDone] = useState(false);

  const {t,i18n} = useTranslation();

  const slides = [
    {
      key: "one",
      title: t("onboardtext1"),
      text:
        "aware yourself about snake species: Learn about venomous and non-venomous reptiles on planet Earth in detail",
      image: require("../../assets/slider.png"),
    },
    {
      key: "two",
      title:  t("onboardtext2"),
      text: 
        "notify snake rescue team: Protect them and protect yourselves by notifying the nearest rescue team ",
      image: require("../../assets/onboardtwo.png"),
    },
    {
      key: "three",
      title:  t("onboardtext3"),
      text:
        "identify snake species: No matter what type of snake it is - always better to identify and differentiate them properly",
      image: require("../../assets/onboardthree.png"),
      
    },
  ];
  


  _renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <Image 
          source={item.image}
          style={{
            resizeMode: "contain",
            height: "60%",
            width: "100%",
          }}
        />
        <View  style={{
           alignContent:'center',
            justifyContent:'center',
            alignItems:'center'
          }}>
        <Text
          style={{
            paddingTop: 25,
            paddingBottom: 10,
            fontSize: 23,
            fontWeight: "bold",
            color: "#21465b",
   
          }}
        >
          {item.title}
        </Text>

        </View>
       

        <Text style={{
          textAlign:"center",
          color:"#b5b5b5",
          fontSize:15,
          paddingHorizontal:30
        }}>
          {item.text}
        </Text>
      </View>
    );
  };
  _onDone = () => {
    setDone({ isDone: true });
  }
  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="arrow-forward-ios"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="done"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _showButton =()=>{
return(
<View>
<Button
  
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
  
</View>
);
  };

  if (isDone){
    return <SignUp/>
  } else 
  return (
  <AppIntroSlider
    renderItem={_renderItem} 
    data={slides} 
    activeDotStyle={{
      backgroundColor:COLORS.primary,
      width:30
    }}
    onDone={_onDone}
    renderDoneButton={_renderDoneButton}
    renderNextButton={_renderNextButton}
   />
   

  );
  };

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  
});



  export default OnBoardScreen;