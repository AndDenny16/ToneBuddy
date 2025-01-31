import React, {useEffect, useState} from 'react';
import { Text, View, Button, TextInput, Alert, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Header from '../components/Header';
import VocabCard from '../components/VocabCard';
import StyleButton from '../components/StyleButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { resetStatus, fullUpdateThunk } from '../store/userReducer2';






const HomeScreen = () => {

    const {longestStreak, username, updated} = useSelector((state) => state.user);

    const dispatch = useDispatch();

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

    const {currentStreak, error, status} = useSelector((state)=> state.user);
    console.log("htis", status)

    const errorIcon = () => {
        switch(status){
            case 'failed': 
            return (
                <View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold',textAlign: 'center', paddingLeft: 6, paddingVertical: 2}}>Failed Stats/Streak Upload</Text>
                <Text style={style.errorText}>Click to Retry</Text>
                </View>
            )


            case 'loading': 
                return (
                <ActivityIndicator color = 'white' size = {10} />
            )

        }
    }
  return (
    <SafeAreaProvider>

    <SafeAreaView style = {style.container}>
      <Header headerText={"Tone Buddy"}/>
    
      <View style = {style.streakStyle}>
            <Icon name = "fire" size = {30} marginRight = {5} color={"red"}/>
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
                        borderWidth: 2

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
        {error &&
        <TouchableOpacity style={style.errorOverlay} onPress = {() => dispatch(fullUpdateThunk({username: username, longest: longestStreak, updated: updated}))}>
        <View>
           {errorIcon()}
        </View>
        </TouchableOpacity>}
        
     
      
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
        fontSize: 20,
        fontWeight: 'bold'


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
        borderRadius: 8,
        paddingLeft: 5    
    },
    errorOverlay: {
        borderWidth: 2,
        borderColor:'black',
        position: 'absolute',
        width: "45%",
        height: "8%",
        top: "92%",
        left: "-12%",
        backgroundColor: 'rgba(200, 0, 0, 0.8)', // Semi-transparent black background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensures it is above the VocabCard
        borderRadius: 10, 
        
    },
    
    errorText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        paddingLeft: 6,
    },

})

export default HomeScreen;