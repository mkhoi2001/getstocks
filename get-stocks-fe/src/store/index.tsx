import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import themeAdminConfigSlice from './themeAdminConfigSlice';
import systemConfigSlice from './systemConfigSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    themeAdminConfig: themeAdminConfigSlice,
    systemConfig: systemConfigSlice,
    user: userReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// export default configureStore({
//     reducer: rootReducer,
// });

export type IRootState = ReturnType<typeof rootReducer>;
