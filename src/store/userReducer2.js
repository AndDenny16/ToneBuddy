import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env"




const fullUpdate = createAsyncThunk(
    'user/fullupdate',
    async({username, longest, updated}, thunkAPI) => {
        try{
            const response = await fetch(`${API_URL}/fullupdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    "username": username,
                    "updatedCharacters": updated,
                    "longestStreak": longest
                })
            });

            console.log(response)
            if (!response.ok){
                console.log('H343')
                throw new Error("Streak/Stats not Saved!");
            }
            const responseData = await response.json();
            return responseData
        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const createUser = createAsyncThunk(
    'user/createuser',
    async(username, thunkAPI) => {
        try{
            const response = await fetch(`${API_URL}/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    "username": username
                })
            });

            if (!response.ok){
                const responseData = await response.json();
                throw new Error(responseData.error);
            }
            const responseData = await response.json();
            return responseData;

        }catch (error) {
            return thunkAPI.rejectWithValue(error.message);

        };

    }

)
const getUserData = createAsyncThunk(
    'user/getUserData',
    async(username, thunkAPI) => {
        try{
            const response = await fetch(`${API_URL}/fetchuser?username=${encodeURIComponent(username)}`);
            if(!response.ok){
                throw new Error("User Data Not Found");
            }
            const responseData = await response.json();
            console.log(responseData)
            return responseData


        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const updateUser = createAsyncThunk(
    "user/updateUser", 
    async({username, updated}, thunkAPI) => {
        try{
            const response = await fetch(`${API_URL}/updateuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    "username": username,
                    "updatedCharacters": updated
                })
            });

            if (!response.ok){
                throw new Error("Connect to Internet to Save Accuracies");
            }
            const responseData = await response.json();
            return responseData
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const updateUserLS = createAsyncThunk(
    "user/updateUserLS", 
    async({username, longest}, thunkAPI) => {
        try{
            console.log("this is the longest", longest);
            const response = await fetch(`${API_URL}/updatestreak`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    "username": username,
                    "longestStreak": longest
                })
            });
            console.log(response);

            if (!response.ok){
                throw new Error("Connect to Internet to Update Streak");
            }
            const responseData = await response.json();
            return responseData
        }catch(error){
            return thunkAPI.rejectWithValue(error.message); 
        }

    }



)



const userReducer = createSlice({
    name: 'user',
    initialState: {
        username: '',
        updated: [],
        currentStreak: {
            last: "",
            length: 0
        },
        longestStreak: {
            last: "",
            length: 0
        },
        accuracyArray: [],
        error: null,
        status: 'idle'
    },
    reducers: {
        incorrect: (state, action) => {
            const {wordObj} = action.payload;
            if (state.currentStreak.length >= state.longestStreak.length){
                state.longestStreak.length = state.currentStreak.length
            }
            state.currentStreak = {
                length: 0,
                last: ""
            }
            const {character} = wordObj;
            let updatedObject = null;
            state.accuracyArray = state.accuracyArray.map((item) => {
                if (item.character == character){
                    updatedObject = {...item, attempts: item.attempts +1, correct: item.correct }
                    return updatedObject
                }else{
                    return item
                }
            }
            );
            if (updatedObject){
                state.updated.push(updatedObject);
            }

        },

        correct: (state, action) => {
            const {wordObj} = action.payload;
            const {character} = wordObj;
            state.currentStreak = {
                length: state.currentStreak.length + 1,
                last: character
            }
            
            let updatedObject = null;
            state.accuracyArray = state.accuracyArray.map((item) => {
                if (item.character == character){
                    updatedObject = {...item, attempts: item.attempts +1, correct: item.correct + 1 }
                    return updatedObject
                }else{
                    return item
                }
            }
            );
            if (updatedObject){
                state.updated.push(updatedObject);
            }

            if (state.currentStreak.length >= state.longestStreak.length){
                state.longestStreak.length = state.currentStreak.length
            }

        },
        resetStatus: (state, action) => {
            state.status = 'idle'
            state.error = null
        }


    },
    extraReducers: (builder) => {
        builder
            //CreateUser cases
            .addCase(createUser.pending, (state) => {
                state.error = null
                state.status = 'loading';
            
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'success';
                const {username,longestStreak, stats} = action.payload;
                state.username = username;
                state.longestStreak = longestStreak;
                const accuracyList = Object.entries(stats).map(([character, stats]) => ({
                    ...stats,
                    character

                }))
                state.accuracyArray = accuracyList
                state.error = null;

            })
            .addCase(createUser.rejected, (state, action) => {
                console.log(action.payload)
                state.status = 'failed';
                state.error = action.payload;
            })
            //GetUser CASES
            .addCase(getUserData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.status = 'success';
                const {longestStreak, stats} = action.payload;
                state.longestStreak = longestStreak;
                const accuracyList = Object.entries(stats).map(([character, stats]) => ({
                    ...stats,
                    character

                }))
                state.accuracyArray = accuracyList;
                state.error = null;

            })
            .addCase(getUserData.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })
            //Update User Cases
            .addCase(updateUser.fulfilled, (state,action) => {
                state.updated = [];
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed'
            })
            .addCase(updateUserLS.rejected, (state,action) => {
               state.error = action.payload;
               state.status = 'failed'
            })
            .addCase(fullUpdate.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fullUpdate.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })
            .addCase(fullUpdate.fulfilled, (state, action) => {
                console.
                state.error = null;
                state.status = 'success';
                state.updated = [];
            })
    }
})


export const { correct, incorrect,resetStatus } = userReducer.actions; //Non async actions
export default userReducer.reducer; 
 //async thunks
export const getUserDataThunk = getUserData;
export const updateUserThunk = updateUser;
export const updateUserLSThunk = updateUserLS;
export const createUserThunk = createUser; 
export const fullUpdateThunk = fullUpdate;