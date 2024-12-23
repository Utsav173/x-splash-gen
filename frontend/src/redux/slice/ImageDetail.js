// ImageDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchComments,
  handleCreateComment,
  handleCreatePost,
  handleDeletePost,
  handleFetchSinglePost,
  handleReplyComment,
} from '../asyncThunk/imageDetailThunk';

const initialState = {
  imageDetail: null,
  comments: [],
  refetchComments: false,
  openReplyInput: null,
  error: '',
  createLoading: false,
};

const imageDetailSlice = createSlice({
  name: 'imageDetail',
  initialState,
  reducers: {
    setImageDetail: (state, action) => {
      state.imageDetail = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setRefetchComments: (state, action) => {
      state.refetchComments = action.payload;
    },
    setOpenReplyInput: (state, action) => {
      state.openReplyInput = action.payload;
    },
    setCreateLoading: (state, action) => {
      state.createLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleCreatePost.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(handleCreatePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleFetchSinglePost.fulfilled, (state, action) => {
        state.imageDetail = action.payload;
      })
      .addCase(handleFetchSinglePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleCreateComment.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(handleCreateComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleReplyComment.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(handleReplyComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(handleDeletePost.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(handleDeletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setImageDetail,
  setComments,
  setRefetchComments,
  setOpenReplyInput,
  setCreateLoading
} = imageDetailSlice.actions;

export default imageDetailSlice.reducer;
