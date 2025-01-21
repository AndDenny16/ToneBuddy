
import { Text, View, StyleSheet } from "react-native";


const ToneRecap = ({ character, tone, percent, pinyin, attempts, trad }) => {
    return (
        <View style = {style.container}>
            {character === trad ? <Text style = {style.character}> {character}</Text>
            : <Text style = {style.character}> {character} / {trad} </Text>    
        }
            <View >
                <Text style = {[style.tonePercent, {fontWeight: 'bold', fontSize: 25 }]}>{pinyin}</Text>
                <Text style = {style.tonePercent}>Accuracy: {Math.round(percent * 100)}%</Text>
                <Text style = {style.tonePercent}>Attempts: {attempts}</Text>
            </View>
        </View>
    )




}

const style = StyleSheet.create ({
    container: {
        flexDirection: 'row',  
        borderWidth: 3,
        borderColor: 'red',
        width: "100%",
        height: 90, 
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor:'white',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0.5, height: 0.5 }, // Vertical shadow for depth
        shadowOpacity: 0.2, // Transparency of shadow
        shadowRadius: 10, // Soft blur radius
        elevation: 10, 
    },
    character: {
        fontSize: 40,
        marginLeft: 10,
        fontWeight: 'bold'

    },
    tonePercent: {
        fontSize: 15,
        marginLeft: 20

    }



})

export default ToneRecap;