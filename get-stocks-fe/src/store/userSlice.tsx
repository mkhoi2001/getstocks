import { createSlice } from '@reduxjs/toolkit';
import { User } from '../types/user';

const initialState: {
    loading: boolean;
    data: {
        info: User | null;
        accessToken: null | string;
        isLogin: boolean;
    };
    error: undefined | string;
} = {
    loading: false,
    data: {
        info: null,
        accessToken: null,
        isLogin: false,
    },
    error: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action): void => {
            state.data.info = action.payload;
            state.data.isLogin = true;
        },
        updateUserInfo: (state, action): void => {
            state.data.info = { ...(state.data.info as any), ...action.payload };
        },
        setAccessToken: (state, action): void => {
            state.data.accessToken = action.payload;
            state.data.isLogin = true;
        },
        logout: (state): void => {
            state.data.isLogin = false;
            state.data.info = null;
            state.data.accessToken = null;
        },
    },
});

export const { setUser, setAccessToken, logout, updateUserInfo } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
