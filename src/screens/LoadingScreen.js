

import {Text, View, StyleSheet, ActivityIndicator, Alert, Button, Image} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {getUserDataThunk} from '../store/userReducer2';
import StyleButton from '../components/StyleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = () => {
    const navigation = useNavigation();
    const {username, loading, error} = useSelector((state) => state.user);
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
            })
        }
        else{
            navigation.navigate('SignUp')
        }
    };

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <View style = {style.viewStyle}>
            <Image source = {require('../../assets/media/logolfinal2.png')} style = {style.imageStyle} resizeMode="cover" ></Image>
        {
            loading ? <ActivityIndicator size = 'large' color = "red"/> :
            <StyleButton title='Load Failed, Retry?' onPress={getUserData}/>
        }
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





