// // src/store/index.js
// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import sessionReducer from './sessionSlice.js';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['session'], // only persist session slice
// };

// const persistedReducer = persistReducer(persistConfig, sessionReducer);

// const store = configureStore({
//   reducer: {
//     session: persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // needed for redux-persist
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export const persistor = persistStore(store);
// export default store;


// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sessionReducer from './sessionSlice';

const rootReducer = combineReducers({
  session: sessionReducer, // reducer key must be "session"
});

const persistConfig = {
  key: 'root',              // AsyncStorage key will be "persist:root"
  storage: AsyncStorage,
  whitelist: ['session'],   // persist only the session slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export default store;