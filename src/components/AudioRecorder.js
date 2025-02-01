import * as FileSystem from 'expo-file-system'
import {Audio } from 'expo-av'

import { useSelector } from 'react-redux';





export const encodeAudio = async( audioUri ) => {
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    
    return base64Audio

}


export const deleteURI = async(audioUri) => {
  try{
    console.log(audioUri);
    await FileSystem.deleteAsync(audioUri, { idempotent: true });
    console.log('Recording file deleted:', audioUri);
  }
  catch(error){
    console.log(error.message)

  }
}

export const recordingSettings = {
    isMeteringEnabled: true,
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAVE,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_LINEAR_PCM,
      sampleRate: 44100,
      numberOfChannels: 1,
      // For raw PCM, bitRate is often not required
      // but some folks set something like 1411200 for 16-bit, 44.1 kHz mono
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 16000,           // <-- Lower sample rate here
      numberOfChannels: 1,
      bitRate: 256000,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };
