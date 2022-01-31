import React,{useState,useEffect} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../consts/colors';
import categories from '../../consts/categories';
import snakes from '../../consts/snakes';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 20;

const HomeScreen = ({navigation}) => {
  // const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const [userfname, setUserData] = useState();
  const [data, setData] = useState({
    selectedCategoryIndex: 0,
    isModalVisible:false
});

useEffect(() => {
  AsyncStorage.getItem('userRegistrationResponse')

  .then(value =>

  // setUserData( JSON.parse(value).User.firstname),
  // console.log(userData.User.firstname),
  setUserData( JSON.parse(value).User.firstname)
  )
  // alert(AsyncStorage.getItem('userRegistrationResponse'))
  

})


  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setData({
              ...data,
              selectedCategoryIndex: index,
             
          })}>
            <View
              style={{
                backgroundColor:
                  data.selectedCategoryIndex == index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...style.categoryBtn,
              }}>
              <View style={style.categoryBtnImgCon}>
                <Image
                  source={category.image}
                  style={{height: 26, width: 26, resizeMode: 'cover'}}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color:
                    data.selectedCategoryIndex == index
                      ? COLORS.white
                      : COLORS.primary,
                }}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  const Card = ({snakes}) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('DetailsScreen', snakes)}>
        <View style={style.card}>
          <View style={{alignItems: 'center', top:10}}>
            <Image source={snakes.image} style={{height: 120, width: 120}} />
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{snakes.name}</Text>
            <Text style={{fontSize: 14, color: COLORS.grey, marginTop: 2}}>
            {(snakes.description).substr(0, 50)}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 12, fontWeight: 'bold'}}>
            More info
            </Text>
            <View style={style.addToCartBtn}>
              <Icon name="more" size={18} color={COLORS.white} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 28}}>Hello,</Text>
            <Text style={{fontSize: 28, fontWeight: 'bold', marginLeft: 10}}>
   {userfname}
            </Text>
          </View>
          <Text style={{marginTop: 5, fontSize: 18, color: COLORS.grey}}>
          Aware yourself about snakes
          </Text>
        </View>
        <FontAwesome 
                    name="user-circle-o"
                    color={COLORS.primary}
                    size={70}
                />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View style={style.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput
            style={{flex: 1, fontSize: 16}}
            placeholder="Search Sanke Species​"
          />
        </View>
        <View style={style.sortBtn}>
          <Icon name="search" size={28} color={COLORS.white} />
        </View>
      </View>
      <View>
        <ListCategories />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={snakes}
        renderItem={({item}) => <Card snakes={item} />}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 185,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 250,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
