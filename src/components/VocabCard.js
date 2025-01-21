import React, {useEffect, useState, useMemo, useRef} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useSelector, useDispatch } from "react-redux";
import diacriticless from "diacriticless";
import { Audio } from "expo-av";
import { incorrect, correct, updateUserThunk, updateError, updateUserLSThunk } from "../store/userReducer2";
import { getToneThunk, resetToneStatus } from "../store/toneReducer";
import { encodeAudio,recordingSettings, deleteURI  } from "./AudioRecorder";



const VocabCard = ({ tone, pinyin }) => {
    //STATE VARIABLES FOR SWIPING/CORRECT/ATTEMPTED
    const [attempted, setAttempted] = useState(false);
    const [isSwipable, setSwipable] = useState(false);
    const [localError, setlocalError] = useState(null);

    //STATE VARIABLES FOR RECORDING
    const [recording, setRecording] = useState(null);
    const [audioUri, setAudioUri] = useState(null);
    const soundRef = useRef(null);

    //REDUX STATE
    const {accuracyArray: words, updated, username, longestStreak, status} = useSelector((state) => state.user);
    const {currTone, currScore, toneStatus } = useSelector((state) => state.tone);
    const dispatch = useDispatch();

    console.log("STATUS", status)

    //CURRENT VOCAB CARD WORD
    const [currentWord, setCurrentWord] = useState(words[Math.floor(Math.random() * words.length)]);
    //SWIPING TRANSLATION VALUE
    const translateX = useSharedValue(0);
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.30;

    //NAVIGATION
    const navigation = useNavigation(); 
    console.log("cjsdklfjal", currScore)
    
    //Error Notification Function
    const timeoutRef = useRef(null);
    const displayError = (message) => {
        //console.log("updating")
        setlocalError(message)
        if (timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=> {
            //console.log('here')
            setlocalError(null)
            timeoutRef.current = null;
        },3000)

    }

    //REPLAY THE AUDIO BACK TO THE USER
    const playAudio = async() => {
        try{
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true
              });
            if (soundRef.current){
                await soundRef.current.replayAsync();
                return
            }
            const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
            soundRef.current = sound; 
            //await soundRef.current.setVolumeAsync(1.0);
            await soundRef.current.replayAsync();
        }catch(error){
            console.log(error);
            displayError("Issue Playing Audio, Try Again")
        }
    }

    //START RECORDING
    const startRecording = async() =>{
        try{
            if (attempted){
                return
            }
            const { status } = await Audio.getPermissionsAsync();
            if (status == 'granted'){
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: true,
                    staysActiveInBackground: true                       
                });
                const newRecording = new Audio.Recording()
                await newRecording.prepareToRecordAsync(recordingSettings)
                await newRecording.startAsync()
                setRecording(newRecording);
            }else{
                return
            }
        } catch (err) {
            displayError("Issue Starting Recording, Try Again")
        }
    }
    
    //STOP RECORDING AND SET URI
    const stopRecording = async() => {
        try{
            await recording.stopAndUnloadAsync();
        }catch (err) {
            displayError("Issue Stopping Audio")
        }
        const uri = recording.getURI(); 
        setAudioUri(uri);
        const encodedAudio = await encodeAudio(uri)
        toneFunctionality(encodedAudio);
        setRecording(null);
        setAttempted(true);
        setSwipable(true);
    }


    const toneFunctionality = async(encodedAudio) => {
        try {
            await dispatch(getToneThunk({ audio: encodedAudio, username: username }))
            .unwrap()
            .then(() => {
                console.log("currentword", currentWord.tone)
                console.log("may ", currTone)
                
            })
           
           
        } catch (error) {
            displayError("Error Detecting Tone");
        }
    };
    

    //update state after swiping
    const updateStates = () => {
        if (toneStatus === 'success'){
            if (currentWord.tone === currTone){
                dispatch(correct({wordObj: currentWord}))
            }
            else{
                dispatch(incorrect({wordObj: currentWord}))
            }

        }
         //will delete later NEED UPDATES
        //ADD ACCURACY FOR CURRENT WORD
        dispatch(resetToneStatus());
        const index = Math.floor(Math.random() * filterData.length);
        setCurrentWord(filterData[index]) //New Word for Vocab CARD
        if (soundRef.current){
            soundRef.current.unloadAsync();
            soundRef.current = null;
        }
        deleteURI(audioUri);
        setAttempted(false);
        setSwipable(false);
        setAudioUri(null);
        updatetoAWS(); //In the Background
        //dispatch(updateUserLSThunk({username, longest: longestStreak}))
        console.log("FINISHED ALL UPDATES")


    }
    ///UPDATE TO AWS = ACCURACIES EVERY 20 WORDS, Updated Words is persisted, so if user exists before 20 its handled
    const updatetoAWS = async() => {
        if (updated.length >= 20){
            console.log("inside here");
            try{
               console.log('Updating to AWS')
               dispatch(updateUserThunk({username, updated}))
               console.log('Successful Update to AWS')

            }catch(error){
                console.error("AWS update failed:", error);
            }
            
        }
    }

    //SwIPING FUNCTIONALITY
    const returnCardPosition = () => {
        translateX.value = withDelay(2000, withSpring(0))
    }
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value }]

    }));
    const swipeGesture = Gesture.Pan()
        .enabled(isSwipable)
        .onUpdate((event) => {
            translateX.value = event.translationX
        }).onEnd(() => {
            if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
                translateX.value = withSpring(SCREEN_WIDTH * Math.sign(translateX.value), {}, () => {
                    runOnJS(updateStates)();
                    runOnJS(returnCardPosition)();
              })} else {
                runOnJS(returnCardPosition)(); // Reset to center if swipe is insufficient
              }
            translateX.value = 0; 
        })

    //FILTER DATA BASED ON PINYIN/TONE, MEMO VALUE SO THIS FUNCTION IS NOT RUN EVERY RERENDER
    const filterData = useMemo(() => {
        return words.filter((item) => {
            let arrayPinyin = diacriticless(item.pinyin.toLowerCase());
            
            if (pinyin.trim() === "") {
                return tone === 'Any' || tone === item.tone;
            } else {
                return (
                    (tone === 'Any' && arrayPinyin.startsWith(pinyin)) ||
                    (tone === item.tone && arrayPinyin.startsWith(pinyin))
                );
            }
        });
    }, [pinyin, tone]);

    
    //WHEN WE HAVE AUDIO URI THIS IS THE CONTENT TO DISPLAY
    const recordingResultComponent = () => {
        if (audioUri){
            return (
               <View style = {{marginTop: 10}}>
                    <TouchableOpacity style = {style.playButton} onPress={playAudio}>
                        <Icon name = "play-circle" size = {16}/>
                        <Text style = {style.compareText}>Playback Audio</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return <></>
        }

    }
    console.log(toneStatus)
    //ONCE WE COMPUTE THE TONE RETURN IT TO THE USER
    const toneResultComponent = () => {
        switch (toneStatus){
        case 'success':
            return(
            <View style = {style.audioContainer}>
                <View style = {[style.toneTextContainer, currentWord.tone === currTone ? {backgroundColor : "lightgreen"} : {backgroundColor: 'lightcoral'}]}> 
                    <Text style = {style.resultStyle}>Your Tone: </Text>
                    <Text style = {style.resultStyle}>{currTone}</Text>
                </View>
                <TouchableOpacity style = {style.navContainer} onPress = {() => navigation.navigate("Voice", {tone: currentWord.tone})}>
                    <Text style = {style.compareText}>See Voice Graph</Text>
                </TouchableOpacity>
           </View>
            )
        case 'loading':
            return (
                <View style = {style.audioContainer} >
                    <ActivityIndicator size = 'large' color = "red"/>
                </View>
            )
        case 'failed':
            return (
                <></>
        

            )
        case 'idle':
            return <></>

        }

    }

    //IF CARD IS REPLAYED - SIMILAR TO UPDATESTATES, JUST DOESN'T CHANGE THE CURRENT WORD
    const replayCard = () => {
        if (attempted){
            setAttempted(false);
            setAudioUri(null); 
            if (soundRef.current){
                soundRef.current.unloadAsync();
                soundRef.current = null;
            }
            if (currentWord.tone === currTone){
                dispatch(correct({wordObj: currentWord}))
            }
            else{
                dispatch(incorrect({wordObj: currentWord}))
            }
            updatetoAWS();
            dispatch(resetToneStatus())
        }
        else{
            return
        }
       
       


    }

    //MAIN CARD COMPONENT
   const mainCard = () => {
        return (
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style = {[style.shadowContainer, animatedStyle, !attempted ? style.notAttempt : currentWord.tone === currTone ? style.correctShadow : style.incorrectShadow] }>
                    <View style = {style.viewStyle}>
                        <View style = {style.redo}> 
                            <Text style = {style.pinyinStyle}> {currentWord.pinyin} {currentWord.tone}</Text>
                            <TouchableOpacity style = {style.redoIconContainer} onPress = {replayCard}>
                                <Icon name="redo" size = {25}/>
                            </TouchableOpacity>
                        </View>
                        {
                            currentWord.character === currentWord.trad 
                            ? <Text style = {style.charcaterStyle}>{currentWord.character}</Text>
                            :
                            <Text style = {style.charcaterStyle}>{currentWord.character} / {currentWord.trad}</Text>

                        }
                        

                        {recording ? 
                            <TouchableOpacity style = {style.microphone} onPress = {stopRecording}>
                                <Icon name = "stop" size = {40} color = "black"/>
                            </TouchableOpacity>
                            : <TouchableOpacity style = {style.microphone} onPress = {startRecording}>
                                <Icon name = "microphone-alt" size = {40} color = "black"/>
                        </TouchableOpacity> }
                        {recordingResultComponent()}
                        {toneResultComponent()}
                    </View>
                </Animated.View>
            </GestureDetector>
        )
    }


    return (
        <View style = {style.overallContainer}>
        {
        filterData.length > 1 ? mainCard() :
        <View style = {{marginTop: 10,  alignItems: 'center', justifyContent: 'center'}}> 
            <Text style = {style.noWord}> Try Another Pinyin/Tone Combo</Text>
        </View>
        }
        {localError 
        ? 
        <View style = {{marginTop: 10, alignItems: 'center', justifyContent: 'center', borderWidth:2, borderColor: 'black'}}> 
            <Text style = {style.noWord}> {localError} </Text>
        </View>
       : <></> }

        </View>



    )





}


const style = StyleSheet.create({

    shadowContainer: {
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 8 }, // Vertical shadow for depth
        shadowOpacity: 0.3, // Transparency of shadow
        shadowRadius: 10, // Soft blur radius
        elevation: 10, // Android shadow
        borderRadius: 17, // Same border radius as inner card
        backgroundColor: 'transparent', // Ensure background is transparent
        borderWidth: 2
    },
    notAttempt: {
        borderColor: 'black'

    },
    correctShadow: {
        shadowColor: 'green',
        borderColor: 'green',
        shadowOpacity: 0.6, // Transparency of shadow
        shadowRadius: 20, // Soft blur radius
        elevation: 12,

    },
    incorrectShadow: {
        shadowColor: 'red',
        borderColor: 'red',
        shadowOpacity: 0.6, // Transparency of shadow
        shadowRadius: 20, // Soft blur radius
        elevation: 12,

    },

    viewStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        width: 300,
        height: 415,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        padding: 10,
    },


    pinyinStyle: {
        fontSize: 25, 
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '500'
    },

    charcaterStyle: {

        fontSize: 70, 
        marginTop: 15,
        fontWeight: 'bold'
    },

    microphone: {
        marginTop: 15,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 50,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },

    navContainer: {
        marginTop: 15,
    },

    compareText: {
        color: 'black',
        fontSize: 16
    },

    resultStyle: {
        fontSize: 25
    },
    audioContainer : {
        flexDirection: 'column',
        margin: 10,
        alignItems: 'center'
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 25,
        width: 200
    },
    toneTextContainer: {
        flexDirection :'row',
        marginVertical:10
    },
    redo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    redoIconContainer: {position: 'absolute', left: 120, top: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center'},
    overallContainer:{
        height: "90%",
        width: "100%",
        alignItems: 'center',
    },
    noWord: {
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 3,
        fontSize: 20,
        borderWidth:2, 
        borderColor: 'black'

    }






})




export default VocabCard