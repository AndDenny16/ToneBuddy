import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";



const HelpScreen = () => {

    const incorrectBullets = [
        "Make sure you are in a location that doesn't have a lot of backgroud noise",
        "Ensure that you are holding the tone for 1-2 seconds. Speaking too quickly will affect your accuracy",
        "If this doesn't work check your Voice Graph to see how your image compares to a native speaker"

    ]



    return (
        <SafeAreaProvider>
            <SafeAreaView style = {styles.container}>
                <Header headerText = "Tone Buddy"/>
                <View style = {styles.whatis}>
                    <Text style = {styles.headings}>FAQs</Text>
                    <View style = {styles.bulletContainer}>
                        <Text style = {[styles.bullet, {fontWeight: "bold"}]}>1.</Text>
                        <Text style = {[styles.bulletText, {fontWeight: "bold", fontSize: 18}]}>My Tone is Correct, Why is it Saying Incorrect?</Text>
                    </View>
                {incorrectBullets.map((point, index) => (
                        <View key={index} style={styles.bulletContainer}>
                        <Text style={styles.bullet}>  {'\u2022'}</Text>
                        <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}

                    <View style = {styles.bulletContainer}>
                        <Text style = {[styles.bullet, {fontWeight: "bold"}]}>2.</Text>
                        <Text style = {[styles.bulletText, {fontWeight: "bold", fontSize: 18}]}>A Character I Want to Study    is Missing?</Text>
                    </View>

                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>  {'\u2022'}</Text>
                        <Text style={styles.bulletText}>Our Database is limited to 2,0000 characters right now. However, we should have every tone-syllable combination!</Text>
                    </View>
                    <Text style = {{marginBottom: 20, marginTop: 5, fontWeight: 'bold', fontSize: 18}}>Thanks for Using Tone Buddy!</Text>
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
        flexDirection: 'column' ,
        borderRadius: 17,
        marginVertical: 15,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 8 }, // Vertical shadow for depth
        shadowOpacity: 0.3, // Transparency of shadow
        shadowRadius: 10, // Soft blur radius
        elevation: 10, // Android shadow
        borderWidth: 2
    },
    headings: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 15,
        fontSize: 40
    },
    questions: {
        fontWeight: "800",
        marginVertical: 10,
        fontSize: 18

    },
    troubleshoot: {
        marginVertical: 5, 
        fontSize: 15

    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
      },
    bullet: {
        fontSize: 18,
        lineHeight: 22,
        marginRight: 6, 
      },
      bulletText: {
        flex: 1, 
        fontSize: 15,
        lineHeight: 22,
      },
    
})

export default HelpScreen;
