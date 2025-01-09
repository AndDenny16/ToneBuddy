import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';





const VoiceGraphScreen = ({ route }) => {
    const tone = route.params['tone'];

    const imageProvider = () => {
        if (tone === 4){
            return (
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginBottom: 10, fontWeight: '800'}}>Native Speaker's Graph</Text>
                <Image source = {require("../../assets/media/4.png")} style = {style.imageStyle} />
            </View>
            )
        }
        if (tone === 2){

            return (
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginBottom: 10, fontWeight: '800'}}>Native Speaker's Graph</Text>
                <Image source = {require("../../assets/media/2.png")} style = {style.imageStyle} />
            </View>
            )
        }
        if(tone === 3){
            return(
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginBottom: 10, fontWeight: '800'}}>Native Speaker's Graphs</Text>
                <View style = {style.threeStyle}>
                    <Image source = {require("../../assets/media/3s.png")} style = {style.smallimageStyle} />
                    <Image source = {require("../../assets/media/3r.png")} style = {style.smallimageStyle} />
                </View>
                <Text style = {{fontSize: 10, marginBottom: 10, fontWeight: '400'}}>Note with third tone, both a smooth graph or interrupted at the bottom are both accurate</Text>
            </View>
            )

        }
    }
    return (
        <SafeAreaProvider>
        <SafeAreaView style = {style.container}>
            <Header headerText = {"Tone Buddy"}/>
            {imageProvider()}
            <View style = {style.imageContainer}>
                <Text style = {{fontSize: 20, marginVertical: 10, fontWeight: '800'}}> Your Graph</Text>
            </View>
           
        </SafeAreaView>
        </SafeAreaProvider>
    )






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


    },
    imageContainer: {

        flexDirection:'column',
        alignItems: 'center'
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

    }
})

export default VoiceGraphScreen