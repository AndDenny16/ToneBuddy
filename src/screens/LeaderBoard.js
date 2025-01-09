import React from 'react';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
import LeaderBoardEntry from '../components/LeaderBoardEntry';
import Header from '../components/Header';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LeaderBoardHeader from '../components/LeaderBoardHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5'





const LeaderBoard = () => {

    const userObj = useSelector((state) => state.user);
    const username = userObj.username;
    const currentStreak = userObj.currentStreak;

    const dataExample = [
        {name : 'Andrew Denny', streak : 10, last: '長'},
        {name : 'Sam Van Horn', streak : 4, last: '好'},
        {name : 'Thomas Baker', streak : 5, last: '四'},
        {name : 'Harrison Diggs1', streak : 1, last: '你'},
        {name : 'Harrison Diggss2', streak : 1, last: '你'},
        {name : 'Harrison Diggss', streak : 1, last: '你'}
    ];
    
    dataExample.sort((a, b) => b.streak - a.streak);

    const deleteStorage = async() => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage successfully cleared!');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };




  return (
    <SafeAreaProvider >
        <SafeAreaView style = {style.container}>
            <Header headerText={"Tone Buddy"} />
            <LeaderBoardHeader/>
            <View style = {style.flatListContainer}>
                <FlatList
                    data={dataExample} // Array of data
                    renderItem={({item, index}) => 
                        <LeaderBoardEntry rank = {index+1} name = {item.name} streak = {item.streak} character = {item.last}/>
                    } // Function to render each item
                    keyExtractor={(item) => item.name} // Unique key for each item
                    showsVerticalScrollIndicator={false} // Optional: hide scroll indicator
                />
            </View>
        <View style = {style.streakContainer}>
            <Text>Your Current Streak</Text>
            <View style = {style.lineStyle}/>
            <View style = {style.streakStyle}>
            <Icon name = "fire" size = {60} color = "red"/>
            <Text style = {style.streakText}>{currentStreak.length} IN A ROW</Text>
        </View>
      
      </View>
      <Button title='delete storage' onPress={deleteStorage}/>
       
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
    streakStyle: {
        flexDirection: "row",
        marginVertical: 10,
    },
      streakText: {
        fontSize: 40,
        marginTop: 10,
        marginLeft: 10
      },
      lineStyle: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        marginVertical: 5
      },
      streakContainer: {
        marginTop: 5,
        width: "100%"
      },
    flatListContainer: {
        height: "58%"
    }

})


export default LeaderBoard;