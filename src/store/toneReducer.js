import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env"
import { correct, incorrect, updateUserLSThunk } from "./userReducer2";




//Main Functionality Thunk 
const getTone = createAsyncThunk(
    "tone/getTone", 
    async({username, audio, currentWord}, {rejectWithValue, dispatch, getState}) => {
        try{
            //Post request with encoded audio and username
            const response = await fetch("http://172.20.10.11:6000/predict", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "audio": audio,
                    "username": username
                })
            });

            //If no response/failed responsed raise an error
            if (!response.ok){
                throw new Error("Error Predicting Tone")
            }

            //GET DATA
            const responseData = await response.json();
            const { prediction } = responseData;

            //GET STATE
            const state = getState();
            const {longestStreak, currentStreak } = state.user;

            //SIDE ACTIONS
            if (currentWord.tone === prediction) {
                dispatch(correct({ wordObj: currentWord }));
            } else {
                if (currentStreak.length != 0 && longestStreak.length === currentStreak.length) {
                    dispatch(updateUserLSThunk({ username, longest: longestStreak }));
                }
                dispatch(incorrect({ wordObj: currentWord }));
            }
            return responseData;
        }catch(error){
            if (error.message.includes("Network")){
                return rejectWithValue("Please Connect to Internet")
            } 
            return rejectWithValue(error.message)
        }
    }
)
const toneReducer = createSlice({
    name: 'tone',
    initialState: {
        currTone: null,
        currScore:null,
        toneStatus:'idle',
        toneError: null,
        swipable: false,

    },
    reducers:{
        resetToneStatus: (state, action) => {
            state.toneStatus = 'idle'
            state.swipable = false
            state.error = null; 
        } 
    },

    extraReducers: (builder) => {
        builder
        .addCase(getTone.pending, (state,action) => {
            state.toneStatus = 'loading';
        })
        .addCase(getTone.fulfilled, (state, action) => {
            const {prediction, score} = action.payload
            state.currTone = prediction;
            state.currScore = score;
            state.toneError = null;
            state.toneStatus = 'success';
            state.swipable = true;
        })
        .addCase(getTone.rejected, (state,action) => {
            state.toneStatus = 'failed';
            state.toneError = action.payload;
            state.swipable = false;
        })


    }


})


export const { resetToneStatus } = toneReducer.actions; //Non async actions
export default toneReducer.reducer; 
export const getToneThunk = getTone;