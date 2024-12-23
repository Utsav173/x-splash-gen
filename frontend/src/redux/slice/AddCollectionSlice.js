// AddCollectionSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  addToCollection,
  createNewCollection,
  fetchCollectionList,
  getSingleCollection,
} from '../asyncThunk/collectionThunk';

const initialState = {
  open: false,
  collectionList: [],
  collectionImages: [],
  title: '',
  error: '',
};

const addCollectionSlice = createSlice({
  name: 'addCollection',
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setCollectionList: (state, action) => {
      state.collectionList = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionList.fulfilled, (state, action) => {
        state.collectionList = action.payload;
      })
      .addCase(fetchCollectionList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createNewCollection.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createNewCollection.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToCollection.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(addToCollection.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getSingleCollection.fulfilled, (state, action) => {
        state.collectionImages = action.payload;
      })
      .addCase(getSingleCollection.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setOpen, setTitle, setCollectionList } =
  addCollectionSlice.actions;

export default addCollectionSlice.reducer;
