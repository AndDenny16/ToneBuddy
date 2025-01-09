import { useState } from 'react';
import {Text, View, StyleSheet} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';




const CustomDropDown = () => {
    const [value, setValue] = useState(null);
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([
        { label: '1st Tone', value: '1st' },
        { label: '2nd Tone', value: '2nd' },
        { label: '3rd Tone', value: '3rd' },
        { label: '4th Tone', value: '4th' },
        {label: 'Any', value: 'Any'}
      ]);

      return (
        <View style = {styles.container}>
            <DropDownPicker 
            open = {open}
            value = {value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select a Tone" 
            style={{
                width: 200, // Set fixed width for alignment
                alignSelf: 'center', // Center within the parent container
            }}
            dropDownContainerStyle={{
                width: 200, // Match the dropdown menu width with picker
                alignSelf: 'center',
                backgroundColor: 'lightblue' // Ensure dropdown menu aligns to center
            }}
            
            
            />

        </View>




      );
    


}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'black',
        marginTop: 50
    }
})


export default CustomDropDown;