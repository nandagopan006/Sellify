import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";


const initialState ={
  products:[],
  selectedProduct:null,
  loading:false,
  error:null,
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.category) {
        params.append("category", filters.category);
      }

      if (filters.minPrice) {
        params.append("min_price", filters.minPrice);
      }

      if (filters.maxPrice) {
        params.append("max_price", filters.maxPrice);
      }

      const queryString = params.toString();
      const baseUrl = "http://127.0.0.1:8000/api/products/";
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok){
        return rejectWithValue(data); 
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Unable to connect to the server.",
      });

    }
  }
)

export const fetchProduct =createAsyncThunk(
   "products/fetchProduct",
   async (productId,{rejectWithValue}) =>{

    try {
      const response = await fetch( `http://127.0.0.1:8000/api/products/${productId}/`);

      const data =await response.json();
      if(!response.ok){

        return rejectWithValue(data);
      }
      return data;
    } catch(error){
      return rejectWithValue({
        message : error.message ||  "Unable to connect to the server.",
      })
    }
   }
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state.auth.accessToken;

      const response = await fetch(
        "http://127.0.0.1:8000/api/products/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message:error.message || "Unable to connect to the server.",
      });
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { productId, productData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();

      const accessToken = state.auth.accessToken;

      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Unable to connect to the server.",
      });
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state.auth.accessToken;

      const response = await fetch(
        "http://127.0.0.1:8000/api/products/my-products/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message|| "Unable to connect to the server.",
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state.auth.accessToken;

      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        return rejectWithValue(data);
      }

      return productId;
    } catch (error) {
      return rejectWithValue({
        message:error.message|| "Unable to connect to the server.",
      });
    }
  }
);



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

    .addCase(fetchProduct.pending, (state)=>{
      state.loading=true
      state.error=null
    })

    .addCase(fetchProduct.fulfilled, (state,action)=> {
      state.loading=false
      state.selectedProduct=action.payload
    })

    .addCase(fetchProduct.rejected, (state,action)=>{
      state.loading=false
      state.error=action.payload
    })

    .addCase(createProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})

  .addCase(createProduct.fulfilled, (state, action) => {
    state.loading = false;
    state.products.push(action.payload);
  })

  .addCase(createProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  .addCase(updateProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(updateProduct.fulfilled, (state, action) => {
  state.loading = false;

  const updatedProduct = action.payload;

  const index = state.products.findIndex(
    (product) => product.id === updatedProduct.id
  );

  if (index !== -1) {
    state.products[index] = updatedProduct;
  }

  state.selectedProduct = updatedProduct;
})

.addCase(updateProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

    .addCase(fetchMyProducts.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(fetchMyProducts.fulfilled, (state, action) => {
  state.loading = false;
  state.products = action.payload;
})

.addCase(fetchMyProducts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

    .addCase(deleteProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(deleteProduct.fulfilled, (state, action) => {
  state.loading = false;

  state.products = state.products.filter(
    (product) => product.id !== action.payload
  );

  if (
    state.selectedProduct &&
    state.selectedProduct.id === action.payload
  ) {
    state.selectedProduct = null;
  }
})

.addCase(deleteProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

  }

})

export default productSlice.reducer;
