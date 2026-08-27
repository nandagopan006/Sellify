import { createSlice , createAsyncThunk } from "@reduxjs/toolkit" 





const initialState={
  user:null,
  accessToken : null,
  refreshToken : null,
  isAuthenticated: false ,
  loading :false,
  error : null
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

const authSlice=createSlice({
  name :"auth",
  initialState,
  reducers:{
    logout(state){
      state.user =null;
      state.accessToken = null;
      state.refreshToken=null;
      state.isAuthenticated=false;
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
      .addCase(login.fulfilled,(state,action)=>{
        state.loading =false
        
        state.user=action.payload.user

        state.accessToken=action.payload.access
        state.refreshToken = action.payload.refresh
        state.isAuthenticated =true


      })
  }
})

export default authSlice.reducer;
export const {logout} = authSlice.actions
