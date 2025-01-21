import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env"



const getImage = createAsyncThunk(
    "image/getImage", 
    async(username, thunkAPI) => {
        try{
            console.log(username);
            const response = await fetch(`${API_URL}/getimage?username=${encodeURIComponent(username)}`)
            if(!response.ok){
                throw new Error("Couldn't fetch image")
            }

            const returnData = await response.json()
            return returnData;

        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }

    }
)


const imageReducer = createSlice({
    name: 'image',
    initialState: {
        currImage: null,
        imageStatus:'idle',
        imageError: null,
        expires: null
    },
    reducers:{
        resetImageStatus: (state, action) => {
            state.toneStatus = 'idle'
        } 
    },

    extraReducers: (builder) => {
        builder
        .addCase(getImage.pending, (state,action) => {
            state.imageStatus = 'loading';
            state.expires = null;
            state.currImage = null;
        })
        .addCase(getImage.fulfilled, (state, action) => {
            const { url, expires } = action.payload
            console.log(url);
            state.currImage = url;
            state.imageError = null;
            state.imageStatus = 'success';
            state.expires = expires
        })
        .addCase(getImage.rejected, (state,action) => {
            state.imageStatus = 'failed';
            state.imageError = action.payload;
        })


    }


})


export const { resetImageStatus } = imageReducer.actions; //Non async actions
export default imageReducer.reducer; 
export const getImageThunk = getImage;