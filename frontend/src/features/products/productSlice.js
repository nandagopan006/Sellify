import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

const initialState ={
  products:[],
  selectedProduct:null,
  loading:false,
  error:null,
}

export const fetchProducts =createAsyncThunk(
  "products/fetchProducts",

  async ( _ ,{rejectWithValue}) => {
    try {

      const response = await fetch( "http://127.0.0.1:8000/api/products/");

      const data = response.json();

      if (!response.ok){
        return rejectWithValue(data); 
      }

      return data;
    } catch (error){
      return rejectWithValue({
        message: error.message || "Unable to connect to the server."
      })

    }
  }
)

const productSlice = createSlice({
  name : "product",
  initialState,

  reducers:{},

  extraReducers : (builder) => {
    builder
    .addCase(fetchProducts.pending, (state)=> {
      state.loading = true
      state.error=null
    })

    .addCase(fetchProducts.fulfilled, (state,action)=>{
      state.loading = false
      state.products=action.payload

    })

    .addCase(fetchProducts.rejected, (state,action) => {
      state.loading =false
      state.error = action.payload
    })
  }

})

export default productSlice.reducer;