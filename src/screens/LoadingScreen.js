

import {Text, View, StyleSheet, ActivityIndicator, Alert, Button, Image} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {getUserDataThunk, resetStatus} from '../store/userReducer2';
import StyleButton from '../components/StyleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
    const navigation = useNavigation();
    const {username, status, error} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const deleteStorage = async() => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage successfully cleared!');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };


    const getUserData = () => {
        console.log('CHECKING IF ALREADY HAVE USER');
        if (username){
            dispatch(getUserDataThunk(username))
            .unwrap()
            .then(() => {
                navigation.navigate("MainApp");
                dispatch(resetStatus())
            })
        }
        else{
            navigation.navigate('SignUp')
        }
    };

    const loadingDisplay = () => {
        switch (status){
            case "loading":
                return <ActivityIndicator size = 'large' color = "red"/>
            case "failed": 
                return  <StyleButton title='Load Failed, Retry?' onPress={getUserData}/>
            default:
                return <></>
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <View style = {style.viewStyle}>
            <Image source = {require('../../assets/media/logolfinal2.png')} style = {style.imageStyle} resizeMode="cover" ></Image>
            {loadingDisplay()}
        <Button title='delete storage' onPress={deleteStorage}/>
        </View>
    )

}

const style = StyleSheet.create({
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:3,
        flex:1
    }, 
    imageStyle: {
        width: 80,
        height: 80,
        marginRight: 2,
        borderColor: 'black',
        marginBottom: 10 

    }
})



export default LoadingScreen





