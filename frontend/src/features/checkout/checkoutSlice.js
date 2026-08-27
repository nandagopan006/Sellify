import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";


const initialState={
  status:"idle",
  error:null,
};

export const checkout = createAsyncThunk(
  "checkout/checkout",
  async (items, { getState, rejectWithValue }) => {

    try {

      const state = getState();

      const accessToken = state.auth.accessToken;

      const response =await fetch( "http://127.0.0.1:8000/api/checkout/",
        {
          method:"POST",
          headers:{
          "Content-Type" : "application/json",
          Authorization :`Bearer ${accessToken}`
          },
          body:JSON.stringify({
            items: items,
          }),
        }
      );

      const data =await response.json()

      if (!response.ok){
        return rejectWithValue(data);
      }

      return data;


    }catch (error){
      return rejectWithValue({
        message : error.message || "Unable to connect to the server.",
      })
    }
  }
);

const checkoutSlice = createSlice({
  name:"checkout",
  initialState,

  reducers:{
    resetCheckout(state){
      state.status="idle"
      state.error=null
    }

  },

    extraReducers:(builder)=>{
      builder
          .addCase(checkout.pending, (state)=>{
            state.status="loading"
            state.error =null
          })
          .addCase(checkout.fulfilled, (state)=>{
            state.status="success"

          })
          .addCase(checkout.rejected, (state, action) => {
            state.status = "failure";
            state.error = action.payload;
          });
    }

})


export const { resetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
