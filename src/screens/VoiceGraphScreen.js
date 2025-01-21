import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getImageThunk } from '../store/imageReducer';





const VoiceGraphScreen = ({ route }) => {
    const tone = route.params['tone'];
    const dispatch = useDispatch();
    const {username}  = useSelector((state) => state.user);
    const {currImage, imageStatus, imageError, expires}  = useSelector((state) => state.image);
    const [localError, setlocalError] = useState(null);
    const timeoutRef = useRef(null);

    const displayError = (message) => {
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
    console.log(imageStatus);
    useEffect(() => {
        const currentTime = Date.now()/1000
        console.log(currentTime);
        console.log(expires)
        if (!currImage || expires <= currentTime){
            console.log("Expired URL")
            try{
                dispatch(getImageThunk(username));
            }
            catch(error){
                console.log(error.message)
            }
            
        }
        else{
            console.log("fine URL")
            return;
        }
        
    }, []);
    

    const nativeImageProvider = () => {
        if (tone === 4){
            return (
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginVertical: 15, fontWeight: '800'}}>Native Speaker's Graph</Text>
                <Image source = {require("../../assets/media/4.png")} style = {style.imageStyle} />
            </View>
            )
        }
        if (tone === 2){

            return (
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginVertical: 15, fontWeight: '800'}}>Native Speaker's Graph</Text>
                <Image source = {require("../../assets/media/2.png")} style = {style.imageStyle} />
            </View>
            )
        }
        if(tone === 3){
            return(
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginVertical: 15, fontWeight: '800'}}>Native Speaker's Graphs</Text>
                <View style = {style.threeStyle}>
                    <Image source = {require("../../assets/media/3s.png")} style = {style.smallimageStyle} />
                    <Image source = {require("../../assets/media/3r.png")} style = {style.smallimageStyle} />
                </View>
                <Text style = {{fontSize: 10, marginVertical: 10, fontWeight: '400'}}>Note with third tone, both a smooth graph or interrupted at the bottom are both accurate</Text>
            </View>
            )

        }
        if (tone === 1){
            return (
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginVertical: 15, fontWeight: '800'}}>Native Speaker's Graph</Text>
                <Image source = {require("../../assets/media/1.png")} style = {style.imageStyle} />
            </View>
            )
        }
        
    }

    const userImageProvider = () => {
        switch (imageStatus){
            case 'success':
            return(
            <View style = {style.imageContainer}>
                <Image source = {{uri: currImage}} style = {style.imageStyle} />
           </View>
            )
        case 'loading':
            return (
                <View style = {style.imageContainer} >
                    <ActivityIndicator size = 'large' color = "red"/>
                </View>
            )
        case 'failed':
            return (
                <View style = {{marginTop: 10, width: 200, alignItems: 'center', justifyContent: 'center'}}> 
                    <Text style = {style.noWord}> {imageError} </Text>
                </View>
        

            )
        case 'idle':
            return (<></>)

        }
    };
    return (
        <SafeAreaProvider>
        <SafeAreaView style = {style.container}>
            <Header headerText = {"Tone Buddy"}/>
                {nativeImageProvider()}
                <View style = {style.textContainer}>
                <Text style = {{fontSize: 20, marginVertical: 10, fontWeight: '800'}}> Your Graph</Text>
                </View>
                {userImageProvider()}
            <View style={style.textContainer}>
                    <Text style = {style.bulletText}>The bright yellow is the tone of your voice, examine the similarities between the two lines</Text>
            </View>
           
        </SafeAreaView>
        </SafeAreaProvider>
    );



}

const style = StyleSheet.create({
    line: {
        borderBottomColor: '#ccc', // Line color
        borderBottomWidth: 2, // Line thickness
        marginVertical: 10, // Optional: space above and below
      },
      container: {
        flex: 1, 
        backgroundColor: '#f0f0f0',
        margin: 30,
        marginTop: 10

    },
    imageStyle: {
        width: 200,
        height: 200,
        borderColor: 'black',
        marginBottom: 10 ,
        marginWeight: 100



    },
    imageContainer: {

        flexDirection:'column',
        alignItems: 'center',
    },
    threeStyle: {
        flexDirection: 'row'
    },
    smallimageStyle:{
        width: 150,
        height: 150,
        borderColor: 'black',
        marginBottom: 10 ,
        marginHorizontal: 10

    },
    noWord: {
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 3,
        fontSize: 20

    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginHorizontal: 20
      },
      bulletText: { // Ensures text wraps properly
        fontSize: 12,
        textAlign: 'center'
      },
    

})

export default VoiceGraphScreen