import { createSlice , createAsyncThunk } from "@reduxjs/toolkit" 
import {clearAuthData,getAuthData,saveAuthData,} from "./authStorage";


const savedAuth = getAuthData();

const initialState = {
  user: savedAuth?.user || null,
  accessToken: savedAuth?.accessToken || null,
  refreshToken: savedAuth?.refreshToken || null,
  isAuthenticated: Boolean(savedAuth?.accessToken),
  loading: false,
  error: null,
};



export const login =createAsyncThunk(
  "auth/login",
  async (loginData, {rejectWithValue}) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login/",
      {method:"POST",
        headers :{
          "Content-Type":"application/json"
        },
        body : JSON.stringify(loginData),
      }

    );
    const data = await response.json();

    if (!response.ok){
      return rejectWithValue(data);
    }

    return data;

    }catch (error) {
      return rejectWithValue({
        message : error.message || "Unable to connect to the server.",
      });
    }

  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, { rejectWithValue }) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/signup/",
      {method:"POST",
        headers :{
          "Content-Type":"application/json"
        },
        body : JSON.stringify(signupData),
      }

    );
    const data = await response.json();

    if (!response.ok){
      return rejectWithValue(data);
    }

    return data;

    }catch (error) {
      return rejectWithValue({
        message : error.message || "Unable to connect to the server.",
      });
    }

  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state.auth.accessToken;
      const refreshToken = state.auth.refreshToken;

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/logout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message||"Unable to connect to the server.",
      });
    }
  }
);


const authSlice=createSlice({
  name :"auth",
  initialState,
  reducers:{
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      clearAuthData();
    },

    clearAuthError(state) {
      state.error = null;
    },

  },

  extraReducers :(builder) =>{
    builder
      .addCase(login.pending,(state) => {
        state.loading =true;
        state.error =null
      })

      .addCase(login.rejected , (state,action)=> {
        state.loading =false
        state.error =action.payload
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;

        state.isAuthenticated = true;

        saveAuthData({
          user: action.payload.user,
          accessToken: action.payload.access,
          refreshToken: action.payload.refresh,
        });
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup does not log the user in: the backend sends back the new user
      // but no tokens, so we only stop the loading spinner here.
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;

        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;

        clearAuthData();
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        clearAuthData();
      })
  }
})

export default authSlice.reducer;
export const {logout, clearAuthError} = authSlice.actions
