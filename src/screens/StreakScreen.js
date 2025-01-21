import React, {useMemo, useState} from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';
import ToneRecap from '../components/ToneRecap';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import diacriticless from 'diacriticless'

const StreakScreen = () => {

  //Array that contains our Accuracies
  const {accuracyArray: accuracies} = useSelector((state) => state.user);
  
  const [open, setOpen] = useState(false);
  const [value, setValue ] = useState("Any");
  const [items, setItems] = useState([
    { label: '1st Tone', value: 1 },
    { label: '2nd Tone', value: 2 },
    { label: '3rd Tone', value: 3 },
    { label: '4th Tone', value: 4 },
    {label: 'Any', value: 'Any'}
  ]);

  const [text, setText] = useState(""); //State for Text Input

  //Function to filter Accuracy Arrays based on Text/Dropdown Inputs, Memo Value so that the function is not run until text/value is updated
  const filterData = useMemo(()=> {
    return accuracies.filter((item) => {
      let pinyin = diacriticless(item.pinyin.toLowerCase());
      if (text.trim() === ""){
        return value === 'Any' || value === item.tone;
      } 
      else{
        return  (value === 'Any' && pinyin.startsWith(text)) ||
        (value === item.tone && pinyin.startsWith(text))
      }
      
    }).sort((a,b) => b.attempts - a.attempts)
  }, [text, value]);

  
  return (
    <SafeAreaProvider>
    <SafeAreaView style = {styles.container}> 
      <Header headerText={"Tone Buddy"}/>
      <View style = {styles.inputsContainer}>
        <View style = {styles.dropdownContainer}>
              <DropDownPicker 
              open = {open}
              value = {value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select a Tone" 
              style={{
                  width: 120,
                  borderWidth: 2// Set fixed width for alignment
              }}/>


            
        </View>

          <View>
            <TextInput 
                placeholder='Specific Pinyin' value = {text} onChangeText={(newText) => setText(newText.trim())} style = {styles.textInput} placeholderTextColor={'black'}
                autoCorrect={false} autoCapitalize='none'
                />

          </View>
        </View>
      <View style = {styles.flatList} >
          <FlatList 
          data={filterData.length > 100 ? filterData.slice(0,100): filterData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />} 
          renderItem={({item}) => 
            <ToneRecap character={item.character} tone = {item.tone} percent = {item.attempts> 0 ? item.correct/item.attempts : 0} pinyin = {item.pinyin} attempts={item.attempts} trad = {item.trad}/>
          
          }
          
          />

      </View>

    </SafeAreaView>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
container: {
  flex: 1, 
  backgroundColor: '#f0f0f0',
  marginTop: 10,
  margin: 30

},
dropdownContainer: {
  marginTop: 10,

},
flatList: {
  marginTop: 15,
  marginBottom: 150
},
textInput: {
  backgroundColor: 'white',
  borderWidth: 2,
  borderRadius:8,
  width: 170,
  height: 50,
  marginTop: 10,
  paddingLeft: 8
},
inputsContainer:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
},
cText: {
  fontSize: 20
},

});

export default StreakScreen;