import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { RootState } from "app/store";
import { auth } from "firebaseConfig";

interface AuthState {
    userId: string | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    userId: null,
    token: null,
    loading: false,
    error: null,
};

interface AuthResponse {
    userId: string;
    token: string;
}

interface AuthCredentials {
    email: string;
    password: string;
}

export const signIn = createAsyncThunk<AuthResponse, AuthCredentials>(
    'auth/signIn',
    async (credentials, thunkAPI) => {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            const token = await userCredential.user.getIdToken();
            return {
                userId: userCredential.user.uid,
                token: token,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue((error as Error).message);
        }
    }
);

export const signUp = createAsyncThunk<AuthResponse, AuthCredentials>(
    'auth/signUp',
    async (credentials, thunkAPI) => {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            const token = await userCredential.user.getIdToken();
            return {
                userId: userCredential.user.uid,
                token: token,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue((error as Error).message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOut(state: AuthState) {
            state.userId = null;
            state.token = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state: AuthState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.userId = action.payload.userId;
                state.token = action.payload.token;
            })
            .addCase(signIn.rejected, (state: AuthState, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signUp.pending, (state: AuthState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.userId = action.payload.userId;
                state.token = action.payload.token;
            })
            .addCase(signUp.rejected, (state: AuthState, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { signOut } = authSlice.actions;

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;