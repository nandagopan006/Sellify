import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
  id: 0,
  message: "",
  type: "success",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,

  reducers: {
   
    showToast(state, action) {
      state.id = state.id + 1;
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },

    hideToast(state) {
      state.message = "";
    },
  },
});

export default toastSlice.reducer;
export const { showToast, hideToast } = toastSlice.actions;
