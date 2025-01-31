import {View, Text, StyleSheet, TouchableOpacity, Button, Dimensions, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import react, {useState } from 'react';
import StyleButton from '../components/StyleButton';
import {createUserThunk, resetStatus} from '../store/userReducer2'
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';





const SignUpScreen = () => {
    const navigation = useNavigation();
    const [usernameText, setUsername] = useState("");
    const {error, status} = useSelector((state) => state.user)
    const {width, height} = Dimensions.get('window');

    const isValidInput = (text) => /^\w+$/.test(text);



    const pros = [
        "Tone Buddy is your solution to improve your pronounciation of Mandarin Chinese's 4 Tones",
        "Uses Machine Learning to tell you whether your tone is correct",
        "Displays Voice Graphs of the tone of your voice and allows you to compare it to native speakers",
        "Tracks your stats across different tones and characters so you see where you can improve"
    ]


    const dispatch = useDispatch();
    const setUsernameRedux = () => {
        if(!isValidInput(usernameText)){
            Alert.alert('Error', 'Invalid username');
            return;
        }
        dispatch(createUserThunk(usernameText))
        .unwrap()
        .then(() => {
            navigation.navigate("MainApp");
        })
        
    }


    const resetStateToIdle = () => {
        setTimeout(() => {
            dispatch(resetStatus()); // Replace with your actual Redux action
        }, 2500); // 5 seconds
    };
    const loginSwitch = () => {
        switch(status){
            case 'idle':
                return(
       
                        <StyleButton title = "Sign Up!" onPress={setUsernameRedux}/>
        
                )

            case "loading": 
                return(
                
                        <ActivityIndicator size = 'small' color = "red"/>
          

                )
            case "failed": 
                resetStateToIdle()
                return (
                        <Text style = {{color: 'black', fontSize: 20, fontWeight: 'bold'}}>{error}!</Text>
                )
            case 'success':
                resetStateToIdle()
                return (
                    
                    <Text> Username Created !</Text>
    
                )


        }
    }

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {[style.container]}>
                <Header headerText="Tone Buddy"  />
               
                <View style = {style.inputContainer}>
                    <TextInput placeholder='Desired Username' value = {usernameText} onChangeText={(newText) => setUsername(newText.trim())}
                     placeholderTextColor="black" autoCorrect={false} autoCapitalize='none'
                        style = {style.textInput}/>
                </View>
                <View style = {style.buttonContainer} >
                  {loginSwitch()}
                 </View>


                <Text style = {[style.title, {alignSelf: 'center'}]}>
                        Become Tone Perfect!
                </Text>
                {pros.map((point, index) => (
                    <View key={index} style={style.bulletContainer}>
                    <Text style={style.bullet}>{'\u2022'}</Text>
                    <Text style={style.bulletText}>{point}</Text>
                    </View>
                ))}
                <View style = {style.demo}>
                    <Text style = {{fontSize: 40, marginRight: 10}}> 我</Text>
                    <Icon name = "arrow-right" size = {40} marginRight = {5} color={"red"}/>
                    <Text style = {{fontSize: 30, marginLeft: 5}}> 3rd Tone </Text>
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

    textInput: {
        backgroundColor:'white',
        borderWidth: 2, 
        borderColor: 'red',
        width: "80%",
        height: 50,
        shadowOpacity: 0.3, // Transparency of shadow
        shadowRadius: 10, // Soft blur radius
        elevation: 10, 
        paddingLeft: 5,
        fontSize: 15,
    },
    inputContainer : {
        marginTop: 20,
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop:30,
        height:50
    },
    title: {
        marginTop: 40, 
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 25

    },
    heading: {
        marginVertical: 10,
        fontWeight: '500',
        fontSize: 15
    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
      bullet: {
        fontSize: 18,
        lineHeight: 18,
        marginRight: 4, // Space between bullet and text
    },
      bulletText: {
        flex: 1, // Ensures text wraps properly
        fontSize: 16,
        lineHeight: 20,
    },
    demo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    errorContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 10,
        borderRadius:17, 
        borderWidth:2,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10, 
        backgroundColor: 'red', 
    },
})

export default SignUpScreen;