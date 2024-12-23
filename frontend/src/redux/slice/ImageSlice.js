// imageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { handleFetchPost, handleLikePost } from '../asyncThunk/imageThunk';

const initialState = {
  imageData: [],
  userId: '',
  refetch: false,
  searchTerm: '',
  currentPage: 1,
  totalPages: 1,
  isHomePage: true,
  cols: 5,
  error: '',
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImageData: (state, action) => {
      state.imageData = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setRefetch: (state, action) => {
      state.refetch = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setIsHomePage: (state, action) => {
      state.isHomePage = action.payload;
    },
    setCols: (state, action) => {
      state.cols = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleFetchPost.fulfilled, (state, action) => {
        state.imageData = action.payload.images;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(handleFetchPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleLikePost.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(handleLikePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setImageData,
  setUserId,
  setRefetch,
  setSearchTerm,
  setCurrentPage,
  setTotalPages,
  setIsHomePage,
  setCols,
} = imageSlice.actions;

export default imageSlice.reducer;
