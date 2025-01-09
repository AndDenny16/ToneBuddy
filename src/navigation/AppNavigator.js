import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LeaderBoard from '../screens/LeaderBoard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import StreakScreen from '../screens/StreakScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';
import VoiceGraphScreen from '../screens/VoiceGraphScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HelpScreen from '../screens/HelpScreen';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {

    return (
        <Stack.Navigator 
         initialRouteName="HomePage"
         screenOptions = {() => ({
            headerShown: false,
            gestureEnabled:false
         })}>
            <Stack.Screen name="HomePage" component={HomeScreen} />
            <Stack.Screen name="Voice" component={VoiceGraphScreen} />
        </Stack.Navigator>
    );


};




const BottomNavigator = () => {

    return (
        <Tab.Navigator  
         initialRouteName="Home"
         screenOptions={({route}) => ({
            tabBarIcon: ({ color, focused, size}) => {
                let iconName
                if (route.name === "Home"){
                    iconName = 'home-variant'
                }
                if (route.name === "Leaderboard"){
                    iconName = 'chart-box-outline'
                }
                if (route.name === "My Stats"){
                    iconName = "human-greeting"
                }
                if (route.name === "Help"){
                    iconName = 'help'
                }
                
                return <Icon name = {iconName} size = {size} color = {color}/>
            },


            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
            headerShown: false


         })}>

         <Tab.Screen name="Home" component={HomeStack} />
         <Tab.Screen name="My Stats" component={StreakScreen} />
         <Tab.Screen name="Help" component={HelpScreen} />
         </Tab.Navigator>
             
    );


};


const AppNavigator = () => {

    return (
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
                headerShown: false,
                gestureEnabled:false 
            }}
        >   
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MainApp" component={BottomNavigator} />
        </Stack.Navigator>
    </NavigationContainer>
    );

}

export default AppNavigator
