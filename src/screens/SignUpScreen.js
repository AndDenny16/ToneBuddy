import {View, Text, StyleSheet, TouchableOpacity, Button, Dimensions, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import react, {useState } from 'react';
import StyleButton from '../components/StyleButton';
import {createUserThunk} from '../store/userReducer2'
import { useDispatch, useSelector } from 'react-redux';





const SignUpScreen = () => {
    const navigation = useNavigation();
    const [usernameText, setUsername] = useState("");
    const {loading, error } = useSelector((state) => state.user)
    const {width, height} = Dimensions.get('window');

    const isValidInput = (text) => /^\w+$/.test(text);


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

    return(
        <SafeAreaProvider>
            <SafeAreaView style = {[style.container]}>
                <Header headerText="Tone Buddy"  />
                <View style = {style.inputContainer}>
                    <TextInput placeholder='Desired Username' value = {usernameText} onChangeText={(newText) => setUsername(newText.trim())}
                     placeholderTextColor="black" autoCorrect={false} autoCapitalize='none'
                        style = {style.textInput}/>
                </View>
                <View style = {style.buttonContainer}>
                    {loading ?  <ActivityIndicator size = 'small' color = "red"/> : <StyleButton title = "Sign Up!" onPress={setUsernameRedux}/>}
                    {error && !loading && <Text style = {{marginTop: 5, fontSize: 20 }}>{error}!</Text>}
                </View>
                

                <View style = {{marginTop:50}}>
                    <Text style = {[style.title, {alignSelf: 'center'}]}>
                        What is Tone Buddy?
                    </Text>
                    <Text style = {[style.heading,{alignSelf: 'center'} ]} >
                        {' • Tone Buddy is your solution to improve your pronounciation of Mandarin Chinese 4 Tones'}
                        {'\n'}
                        {'\n'}
                        {" • Uses Machine Learning to tell you whether your tone is correct "}
                        {'\n'}
                        {'\n'}
                        {" • Tracks your stats across different tones and characters so you see where to improve "}
                        {'\n'}
                        {'\n'}
                        {" • Displays Voice Graphs of your tone and compare to native speakers "}
                    </Text>
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
        width: 270,
        height: 50,
        shadowOpacity: 0.3, // Transparency of shadow
        shadowRadius: 10, // Soft blur radius
        elevation: 10, 
    },
    inputContainer : {
        marginTop: 30,
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop:10
    },
    title: {
        marginVertical: 20, 
        fontWeight: 'bold',
        fontSize: 25

    },
    heading: {
        marginVertical: 10,
        fontWeight: '500',
        fontSize: 15



    }
})

export default SignUpScreen;