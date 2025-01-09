
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const LeaderBoardHeader = () =>{

    return (
        <View style = {style.headerContainer}>
                <Text flex = {3} marginLeft= {15}>Username</Text>
                <Text flex = {1}>Last</Text>
                <Text flex = {1}>Length</Text>
        </View>



    )





}


const style = StyleSheet.create({
    streakStyle: {
        marginRight: 20,
        flexDirection: 'row'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: 'white'
    }
})

export default LeaderBoardHeader;