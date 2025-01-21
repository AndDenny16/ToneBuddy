import * as FileSystem from 'expo-file-system'
import {Audio } from 'expo-av'



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
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 1411200, // 44.1kHz * 16 bits * 1 channel
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

