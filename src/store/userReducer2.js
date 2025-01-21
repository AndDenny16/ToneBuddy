import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env"




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
             
            console.log(response);

            if (!response.ok){
                throw new Error("User not Created, Try Again");
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
            console.log(API_URL)
            const response = await fetch(`${API_URL}/fetchuser?username=${encodeURIComponent(username)}`);
            if(!response.ok){
                throw new Error("User Data Not Found");
            }
            const responseData = await response.json();
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
            const body = JSON.stringify({
                "updatedCharacters": updated
            });

            if (!response.ok){
                throw new Error("Connect to Internet to Update Accuracies");
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

        },
        resetStatus: (state, action) => {
            state.status = 'idle'
        }


    },
    extraReducers: (builder) => {
        builder

            //CreateUser cases
            .addCase(createUser.pending, (state) => {
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
                state.status = 'failed';
                state.error = action.payload;
            })
            //GetUser CASES
            .addCase(getUserData.pending, (state) => {
                state.status = 'loading';
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
            //UpdateUser Cases
            .addCase(updateUser.fulfilled, (state,action) => {
                state.updated = [];
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateUserLS.rejected, (state,action) => {
               state.error = action.payload
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