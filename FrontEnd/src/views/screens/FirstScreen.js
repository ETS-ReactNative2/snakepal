

import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
import COLORS from '../../consts/colors';
import {PrimaryButton} from '../components/Button';
import SwitchSelector from 'react-native-switch-selector';
import { useTranslation } from 'react-i18next';
const options = [
  { label: "English", value: "en" },
  { label: "සිංහල", value: "si" }
];
 
const FirstScreen = ({navigation}) => {
  const {t,i18n} = useTranslation();
  
    return (

<View style={{flex:1,backgroundColor:'#ffffff'}}>
   <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
   <Image
     style={{height:400,width:400}}
     source={require('../../assets/snakepallogo.png')} />
     
   </View>
   <View style={{flex:2}}>
      <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
         <Text style={{fontSize:30,fontWeight:'bold'}}>{t("welcomeMsg")} </Text>
         <Text style={{fontSize:30,fontWeight:'bold'}}>{t("welcomeMsg1")} </Text>

<View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
<Text style={{color:'#908e8c'}}>{t("welcomeSubText")}</Text>
         <Text style={{color:'#908e8c'}}>{t("welcomeSubText1")} </Text>

</View>
<View style={{justifyContent:'center',alignItems:'center'}}>
        <SwitchSelector options={options} hasPadding initial={0} style={{width:200}} height={40} buttonColor={COLORS.primary}
        onPress={(language) =>{
i18n.changeLanguage(language);
        }}
        />
        </View>

      </View>
     
      <View  style={{flex:2,marginHorizontal:50,marginTop:20}}>
       
     
      <PrimaryButton title={t("welcomebtnText")} onPress={() => navigation.navigate('BoardScreen')} />
    <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
   
       <Text style={{color:'#908e8c'}}>{t("memberCheckText")}</Text><TouchableOpacity onPress={() => navigation.navigate('SignIn')} ><Text style={{fontWeight:'bold'}}>{t("SignInText")}</Text></TouchableOpacity>

    </View>
      </View>
      
  </View>

</View>
    );
  };
  
export default FirstScreen;
