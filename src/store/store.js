import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import userReducer from './userReducer2';
import toneReducer from './toneReducer';
import imageReducer from './imageReducer';
import { persistStore, persistReducer } from 'redux-persist'; 

const persistConfig = {
    key: 'user',
    storage: AsyncStorage,
    whitelist: ['username', 'currentStreak', 'updated']
}


const persistedReducer = persistReducer(persistConfig, userReducer)


const rootReducer = combineReducers({
    user: persistedReducer,
    tone: toneReducer,
    image: imageReducer,
});


const store = configureStore({
    reducer: rootReducer
});


export const persistor = persistStore(store);
export default store; 