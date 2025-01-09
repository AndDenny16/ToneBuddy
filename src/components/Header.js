import { Text, View, StyleSheet, Image } from 'react-native';



const Header = ({headerText}) => {
    return (
        <View>
        <View style = {style.containerStyle}>
            <Image source = {require('../../assets/media/logolfinal2.png')} style = {style.imageStyle} resizeMode="cover" ></Image>
            <Text style = {style.textStyle}>{headerText}</Text>
        </View>
        <View style = {style.line}/>
        </View>




    )

};

const style = StyleSheet.create({
    textStyle: {
        fontSize: 42,
        marginTop: 20,
        marginLeft: 10,
        fontWeight: "500"
    },

    imageStyle: {
        width: 80,
        height: 80,
        borderColor: 'black'
        
    },

    containerStyle: {
        flexDirection: 'row'
    },

    line: {
        borderBottomColor: '#ccc', // Line color
        borderBottomWidth: 2, // Line thickness
        marginVertical: 10,
      },




})


export default Header;

