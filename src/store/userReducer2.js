import { createSlice,createAsyncThunk,  } from "@reduxjs/toolkit";


const createUser = createAsyncThunk(
    'user/createuser',
    async(username, thunkAPI) => {
        try{
            const response = await fetch("https://jjsv72hf07.execute-api.us-east-1.amazonaws.com/dev/createuser", {
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
            const response = await fetch(`https://jjsv72hf07.execute-api.us-east-1.amazonaws.com/dev/fetchuser?username=${encodeURIComponent(username)}`);
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
            const response = await fetch("https://jjsv72hf07.execute-api.us-east-1.amazonaws.com/dev/updateuser", {
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
            
            const response = await fetch("https://jjsv72hf07.execute-api.us-east-1.amazonaws.com/dev/updatestreak", {
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


const getTone = createAsyncThunk(
    "user/getTone", 
    async({username, audio}, thunkAPI) => {
        try{
            
            const response = await fetch("http://172.20.10.11:6000/predict", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "audio": audio,
                    "username": username
                }
            });

            if (!response.ok){
                throw new Error("Connect to the Internet to Get Tone")
            }
            console.log(response)

            const responseData = await response.json();
            return responseData;
        }catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


const userReducer = createSlice({
    name: 'user',
    initialState: {
        username: '',
        updated: [],
        currTone: null,  
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
        loading: false
    },
    reducers: {
        updateStreak: (state, action) => {
            const {length, last} = action.payload; 
            state.currentStreak = {
                length: length,
                last: last
            }
            if (length > state.longestStreak.length){
                state.longestStreak = {
                    length: length,
                    last: last
                }
            }


        },
        updateAccuracy: (state, action) => {
            const {wordObj, correct} = action.payload;
            console.log(wordObj);
            const {character} = wordObj;
            let updatedObject = null;
            state.accuracyArray = state.accuracyArray.map((item) => {
                if (item.character == character){
                    updatedObject = {...item, attempts: item.attempts +1, correct: item.correct + correct }
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
        updateError: (state, action) => {
            const errorMessage = action.payload; 
            state.error = errorMessage
        }


    },
    extraReducers: (builder) => {
        builder

            //CreateUser cases
            .addCase(createUser.pending, (state) => {
                state.loading = true;
            
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
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
                state.loading = false;
                state.error = action.payload;
            })
            //GetUser CASES
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
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
                state.loading = false;
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
            //GetTone Cases
            .addCase(getTone.pending, (state,action) => {
                state.loading = true;
            })
            .addCase(getTone.fulfilled, (state, action) => {
                state.loading = false;
                // const {tone} = action.payload
                // state.tone = tone;
                console.log(action.payload);
            })
            .addCase(getTone.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    } 

})


export const { updateStreak, updateAccuracy, updateError } = userReducer.actions; //Non async actions
export const createUserThunk = createUser;  //async thunks
export default userReducer.reducer; 
export const getUserDataThunk = getUserData;
export const updateUserThunk = updateUser;
export const updateUserLSThunk = updateUserLS;
export const getToneThunk = getTone;