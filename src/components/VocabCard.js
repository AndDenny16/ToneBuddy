import React, {useEffect, useState, useMemo, useRef} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useSelector, useDispatch } from "react-redux";
import diacriticless from "diacriticless";
import { Audio } from "expo-av";
import { updateAccuracy, updateUserThunk, updateError, updateStreak, updateUserLSThunk, getToneThunk } from "../store/userReducer2";
import { encodeAudio } from "./AudioRecorder";



const VocabCard = ({ tone, pinyin }) => {
    //STATE VARIABLES FOR SWIPING/CORRECT/ATTEMPTED
    const [isCorrect, setIsCorrect] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [isSwipable, setSwipable] = useState(false);

    //STATE VARIABLES FOR RECORDING
    const [recording, setRecording] = useState(false);
    const [audioUri, setAudioUri] = useState(null);
    const soundRef = useRef(null);

    //REDUX STATE
    const {accuracyArray: words, updated, username, error, currentStreak, longestStreak, currTone, loading} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    //CURRENT VOCAB CARD WORD
    const [currentWord, setCurrentWord] = useState(words[Math.floor(Math.random() * words.length)]);
    //SWIPING TRANSLATION VALUE
    const translateX = useSharedValue(0);
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.30;

    //NAVIGATION
    const navigation = useNavigation(); 
    
    //Error Notification Function
    const timeoutRef = useRef(null);
    const displayError = (message) => {
        //console.log("updating")
        dispatch(updateError(message))
        if (timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=> {
            //console.log('here')
            dispatch(updateError(null))
            timeoutRef.current = null;
        },3000)

    }

    //REPLAY THE AUDIO BACK TO THE USER
    const playAudio = async() => {
        try{
            if (soundRef.current){
                await soundRef.current.replayAsync();
                return
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
            );
            await sound.playAsync();
            soundRef.current = sound;
        }catch(error){
            console.log(error);
            displayError("Issue Playing Audio, Try Again")
        }
    }

    //START RECORDING
    const startRecording = async() =>{
        try{
            const { status } = await Audio.getPermissionsAsync();
            if (status == 'granted'){
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: true,                       
                });
                const { recording } = await Audio.Recording.createAsync(
                    {
                        // Define your custom recording settings here
                        isMeteringEnabled: true, // Enable metering (useful for audio level analysis)
                        android: {
                          extension: '.wav',
                          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                          sampleRate: 16000, // Sampling rate (standard is 44.1 kHz)
                          numberOfChannels: 1, // Stereo
                          bitRate: 128000, // Bit rate (128 kbps for good quality)
                        },
                        ios: {
                          extension: '.wav',
                          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                          sampleRate: 16000,
                          numberOfChannels: 2,
                          bitRate: 128000,
                          linearPCMBitDepth: 16,
                          linearPCMIsBigEndian: false,
                          linearPCMIsFloat: false,
                        },
                    }
                );
                setRecording(recording);
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
            const uri = recording.getURI(); 
            setAudioUri(uri);
            const encodedAudio = await encodeAudio(uri)
            toneFunctionality(encodedAudio);
        }catch (err) {
            displayError("Issue Stopping Audio")
        }
        setRecording(null);
    }


    const toneFunctionality = async(encodedAudio) => {
        try{
            await dispatch(getToneThunk({audio: encodedAudio, username: username}))
            setAttempted(true);
            setSwipable(true);
            if (currentWord.tone === currTone){
                setIsCorrect(true)
            }
            else{
                setIsCorrect(false)
            }
        }
        catch(err){
            displayError("Error Detecting Tone")

        }

    }
    

    //update state after swiping
    const updateStates = () => {
        dispatch(updateStreak({length: currentStreak.length + 1, last: currentWord.character})) //will delete later NEED UPDATES
        dispatch(updateAccuracy({"wordObj": currentWord, "correct": 1})) //ADD ACCURACY FOR CURRENT WORD
        const index = Math.floor(Math.random() * filterData.length);
        setCurrentWord(filterData[index]) //New Word for Vocab CARD
        if (soundRef.current){
            soundRef.current.unloadAsync();
            soundRef.current = null;
        }
        setAttempted(false);
        setIsCorrect(true);
        setSwipable(false);
        setAudioUri(null);
        updatetoAWS();
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
        console.log(pinyin);
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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value }]

    }));
    console.log("component rerender")
    console.log(currentWord.tone)
    
    //WHEN WE HAVE AUDIO URI THIS IS THE CONTENT TO DISPLAY
    const recordingResultComponent = () => {

        if (audioUri){
            return (
                <View style = {style.audioContainer}>
                     <View style = {[style.toneTextContainer, isCorrect ? {backgroundColor: 'lightcoral'} : {backgroundColor: 'lightgreen'}]} backgroundColor = "lightgreen"> 
                        <Text style = {style.resultStyle}>Your Tone: </Text>
                        <Text style = {style.resultStyle}>3</Text>
                    </View>
                    <TouchableOpacity style = {style.playButton} onPress={playAudio}>
                        <Icon name = "play-circle" size = {16}/>
                        <Text marginTop = {0} marginLeft = {5} fontSize = {20}>Playback Audio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {style.placeholder} onPress = {() => navigation.navigate("Voice", {tone: currentWord.tone})}>
                        <Text style = {style.compareText}>See Voice Graph</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return <></>
        }

    }

    //IF CARD IS REPLAYED - SIMILAR TO UPDATESTATES, JUST DOESN'T CHANGE THE CURRENT WORD
    const replayCard = () => {
        if (attempted){
            setAttempted(false);
            setAudioUri(null); 
            soundRef.current.unloadAsync();
            soundRef.current = null;
            dispatch(updateAccuracy({"wordObj": currentWord, "correct": 1}));
            setIsCorrect(false);
            updatetoAWS();
        }
       


    }

    //MAIN CARD COMPONENT
   const mainCard = () => {
        return (
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style = {[style.shadowContainer, animatedStyle, !attempted ? style.notAttempt : isCorrect ? style.correctShadow : style.incorrectShadow] }>
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
                    </View>
                </Animated.View>
            </GestureDetector>
        )
    }


    return (
        <View style = {style.overallContainer}>
        {
        filterData.length > 1 ? mainCard() :
        <Text style = {style.noWord}> Try Another Pinyin/Tone Combo</Text>}
        {error ? 
        <View style = {{marginTop: 10}}> 
            <Text style = {style.noWord}> {error} </Text>
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

    placeholder: {
        marginTop: 25,
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
        margin: 20,
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
        backgroundColor: 'lightcoral',
        color: 'black',
        borderRadius: 3,
        fontSize: 20

    }






})




export default VocabCard