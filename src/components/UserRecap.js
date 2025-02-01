import { Text, View, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import React, { useMemo} from "react";
import Icon from 'react-native-vector-icons/FontAwesome5'



const UserRecap = () => {
    const {username, currentStreak, accuracyArray: accuracies, longestStreak } = useSelector((state) => state.user);

    const mostMissed = useMemo(() => {
        const filteredAccuracies = accuracies.filter((item) => item.attempts > 0);

    // If no entries remain after filtering, return null or a default value
        if (filteredAccuracies.length === 0) return "N/A";
        let lowest = filteredAccuracies.reduce((prev, current) => {
            const prevPercent = prev.correct / prev.attempts;
            const currentPercent = current.correct / current.attempts;
            return currentPercent <= prevPercent ? current : prev;
        });
        return lowest;

    }, [accuracies])

    const overallAccuracy = useMemo(() => {
        console.log("exufjal")
        const {attempts, correct } = accuracies.reduce((totals, currentValue) => ({
            attempts: totals.attempts + currentValue.attempts,
            correct: totals.correct + currentValue.correct

    }), { attempts: 0, correct: 0 });
        return attempts > 0 ? Math.round(correct/attempts * 100) : 0;

    }, [accuracies])


    return (
        <View style = {style.overallContainer}>
            <View style = {style.horizontal}>
                <Text style = {{fontWeight: 'bold', fontSize: 20, marginTop: 5}}>{username.length >= 14 ? username.slice(0,14) + "..." : username}</Text>
                <View style = {style.streakStyle}>
                    <Icon name = "fire" size = {28} color={"red"} />
                    <Text style = {{marginTop: 8, marginLeft: 5, fontWeight: 'bold'}}>{currentStreak.length > 100000000 ? '\u221E (wow)'  : currentStreak.length}</Text>
                </View>
                <View style = {style.streakStyle}>
                    <Icon name = "trophy" size = {26} color={"red"} style = {{marginTop: 3}}/>
                    <Text style = {{marginTop: 8, marginLeft: 5, fontWeight: 'bold'}}>{longestStreak.length > 100000000 ? '\u221E (wow)'  : longestStreak.length}</Text>
                </View>
            </View>
            <View style = {style.horizontal2}>
                <Text style = {{fontWeight: '500', fontSize: 15}}>Lowest %: {mostMissed.character}({mostMissed.pinyin})</Text>
                <Text style = {{fontWeight: '500', marginLeft: 8, fontSize: 15 }}>Ovr Accuracy: {overallAccuracy}%</Text>
            </View>
        </View>
    )




}

const style = StyleSheet.create ({
    horizontal: {
        flexDirection: 'row',
        marginBottom: 14
    },
    streakStyle: {
        flexDirection: "row",
        alignItems: 'center',
        marginLeft: 10
    },
    overallContainer: {
        flexDirection: 'column',
        borderWidth: 2,
        backgroundColor: 'white',
        borderRadius: 17,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 18,
        marginTop: 12,
        marginBottom: 10
    },
    horizontal2: {
        flexDirection: 'row',
    },


})

export default UserRecap;