import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";



const HelpScreen = () => {

    const incorrectBullets = [
        "Make sure you are in a location that doesn't have a lot of backgroud noise",
        "Ensure that you are holding the tone for 2-3 seconds. Speaking too quickly will affect your accuracy",
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
                        <Text style = {[styles.bulletText, {fontWeight: "bold", fontSize: 20}]}> My Tone is Correct, Why is it Saying Incorrect?</Text>
                    </View>
                {incorrectBullets.map((point, index) => (
                        <View key={index} style={styles.bulletContainer}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.bulletText}>{point}</Text>
                        </View>
                    ))}

                    <View style = {styles.bulletContainer}>
                        <Text style = {[styles.bullet, {fontWeight: "bold"}]}>2.</Text>
                        <Text style = {[styles.bulletText, {fontWeight: "bold", fontSize: 20}]}>A Character I Want to Study is Missing?</Text>
                    </View>

                    <View style={styles.bulletContainer}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.bulletText}>Our Database is limited to 2,0000 characters right now. However, we should have every tone-syllable combination!</Text>
                    </View>
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

    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
      },
    bullet: {
        fontSize: 18,
        lineHeight: 24,
        marginRight: 6, // Space between bullet and text
      },
      bulletText: {
        flex: 1, // Ensures text wraps properly
        fontSize: 16,
        lineHeight: 24,
      },
    
})

export default HelpScreen;
