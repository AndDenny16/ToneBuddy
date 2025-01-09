import { StyleSheet, View, Text, TouchableOpacity  } from "react-native";
import { useNavigation } from '@react-navigation/native';




const StyleButton = ({title, onPress}) =>{

    const navigation = useNavigation();

    return (
        <TouchableOpacity style = {style.touchableStyle} onPress = {onPress}>
            <Text style = {style.textColor}>{title}</Text>
        </TouchableOpacity>
    )


};

const style = StyleSheet.create({

    touchableStyle :{

        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20',
        borderRadius: 20,
        width: 200,
        height: 50,
        backgroundColor: 'red',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 10 }, // Strong vertical shadow for depth
        shadowOpacity: 0.3, // Shadow transparency
        shadowRadius: 10, // Blur radius for a softer look

        // Elevation for Android
        elevation: 12,
    },

    textColor: {
        color: 'white',
        fontSize: 20
    }







})


export default StyleButton