import React, {useEffect, useState} from 'react';
import { Text, View, Button, TextInput, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Header from '../components/Header';
import VocabCard from '../components/VocabCard';
import StyleButton from '../components/StyleButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';





const HomeScreen = () => {

    const getAudioPermission = async () => {
        const {status, canAskAgain} = await Audio.requestPermissionsAsync();
        if (status == 'granted'){
            return
        }
        if (status != 'granted' && canAskAgain){
            const {status : newStatus} = await Audio.requestPermissionsAsync();
            if(newStatus == 'granted'){
                return 
            } 
            
        }
        Alert.alert("Tone Buddy Needs Access to Microphone, Please Go to Settings")

    }


    //CHECK AUDIO PERMISSIONS
    useEffect(() => {
        getAudioPermission()
    }, [])
    
    //DROPDOWN VALUES
    const [value, setValue] = useState('Any');
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([
        { label: '1st Tone', value: 1 },
        { label: '2nd Tone', value: 2 },
        { label: '3rd Tone', value: 3},
        { label: '4th Tone', value: 4},
        {label: 'Any', value: 'Any'}
      ]);

    const [pinyin, setPinyin] = useState(""); //TEXT INPUT

    const {username, currentStreak, longestStreak,} = useSelector((state)=> state.user);
  return (
    <SafeAreaProvider>

    <SafeAreaView style = {style.container}>
      <Header headerText={"Tone Buddy"}/>
    
      <View style = {style.streakStyle}>
            <Icon name = "fire" size = {20} marginRight = {5} color={"red"}/>
            <Text style = {style.streakText}>Your Streak: {currentStreak.length}</Text> 
        </View> 
        <View style = {style.inputsContainer}>
            <View style = {style.dropdownContainer}>
                    <DropDownPicker 
                    open = {open}
                    value = {value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Select a Tone" 
                    style={{
                        width: 120,
                        borderWidth: 2// Set fixed width for alignment
                    }}/>
            </View>
            <View>
                <TextInput 
                    placeholder=' Pinyin' value = {pinyin} onChangeText={(newText) => setPinyin(newText.trim())} style = {style.textInput} placeholderTextColor={'black'}
                     autoCorrect={false} autoCapitalize='none'
                    />

            </View>
        </View>
        <View style = {[style.vocabCardStyleStreak]}>
            <VocabCard tone = {value} pinyin = {pinyin.toLowerCase()}/>
        </View>
        
     
      
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f0f0f0',
        margin: 30,
        marginTop: 10

    },
    headerText: {
        fontSize: 35
    },

    dropdownContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
  },

    vocabCardStyleNoStreak: {
        alignItems: 'center',
        marginTop: 60


    },
    vocabCardStyleStreak: {
        alignItems: 'center',
        marginTop: 20,

    },

    streakStyle : {
        margin: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center'

    },
    streakText: {
        marginTop: 2,
        fontSize: 20


    },
    inputsContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal:30
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 2,
        width: 120,
        height: 50,
        borderRadius: 2
      },

})

export default HomeScreen;