import * as FileSystem from 'expo-file-system'



export const encodeAudio = async( audioUri ) => {
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    
    return base64Audio

}

