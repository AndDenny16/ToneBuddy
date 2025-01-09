
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const LeaderBoardEntry = ({rank, name, streak, character}) =>{

    const checkUserName = (name) => {
        if (name.length >= 20 ){
            return name.slice(0,20)
        }
        return name
    }

    return (
        <View style = {style.entry}>
            <View style = {style.username}>
                <Text style = {style.nameRank}>{rank}. {checkUserName(name)}</Text>
            </View>
            <View style= {style.last}>
                <Text style = {style.nameRank}>{character}</Text>
            </View>
            <View style = {style.streakStyle} >
                <Icon name = "fire" size = {20} color = {"red"} />
                <Text marginTop = {2} marginLeft = {5}>{streak}</Text>
            </View>
        </View>



    )





}


const style = StyleSheet.create({
    entry: {
        borderWidth: 2,
        borderColor: 'black',
        width: 325,
        height: 40,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    streakStyle: {
        marginRight: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    username:{
        flex:3,
        alignItems: 'flex-start',

    },
    last: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameRank: {
        fontWeight : 'bold',
        marginLeft : 10
    }
})

export default LeaderBoardEntry;