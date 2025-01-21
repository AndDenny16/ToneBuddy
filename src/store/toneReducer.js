import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env"



const getTone = createAsyncThunk(
    "tone/getTone", 
    async({username, audio}, thunkAPI) => {
        try{
            
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

            console.log(response);

            if (!response.ok){
                throw new Error("Error Predicting Tone")
            }

            const responseData = await response.json();
            return responseData;
        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
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
    },
    reducers:{
        resetToneStatus: (state, action) => {
            state.toneStatus = 'idle'
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
        })
        .addCase(getTone.rejected, (state,action) => {
            state.toneStatus = 'failed';
            state.toneError = action.payload;
        })


    }


})


export const { resetToneStatus } = toneReducer.actions; //Non async actions
export default toneReducer.reducer; 
export const getToneThunk = getTone;