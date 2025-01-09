import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";



const HelpScreen = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style = {styles.container}>
                <Header headerText = "Tone Buddy"/>
                <View style = {styles.whatis}>
                    <Text style = {styles.headings}>FAQs</Text>
                    <Text style = {{marginTop: 0, marginBottom: 10, fontWeight: 'bold', fontSize: 20 }}>1. My Tone is Correct, Why is it Saying Incorrect?</Text>
                    <Text style = {styles.troubleshoot}> • Make sure you are in a location that doesn't have a lot of backgroud noise</Text>
                    <Text style = {styles.troubleshoot}> • Ensure that you are holding the tone for 2-3 seconds. Speaking too quickly will affect your accuracy</Text>
                    <Text style = {styles.troubleshoot}> • If this doesn't work check your Voice Graph to see how your image compares to a native speaker </Text>
                    <Text style = {styles.questions}>2. A Character I Want to Study Is Missing? </Text>
                    <Text style = {styles.troubleshoot}>
                        {'\t'} Our Database is limited to 2,000 Character right now. We are working to add more. However, we should have every combination of 
                        tone - syllable, so you can use that alternative character to study in the mean time. 
                    </Text>
                    <Text style = {{fontSize: 23, fontWeight: 'bold', marginVertical: 20}}>Thanks for Using Tone Buddy! </Text>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )



}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f0f0f0',
        margin: 30,
        marginTop: 10

    },
    whatis: {
        flexDirection: 'column' 
    },
    headings: {
        fontWeight: 'bold',
        marginVertical: 20,
        fontSize: 40
    },
    questions: {
        fontWeight: "800",
        marginVertical: 10,
        fontSize: 20

    },
    troubleshoot: {
        marginVertical: 5, 
        fontSize: 15

    }
    
})

export default HelpScreen;
