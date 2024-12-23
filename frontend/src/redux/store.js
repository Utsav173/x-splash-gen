import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slice/ImageSlice';
import imageDetailSlice from './slice/ImageDetail';
import addCollectionSlice from './slice/AddCollectionSlice';

const reducer = {
  image: imageReducer,
  imageDetail: imageDetailSlice,
  addCollection: addCollectionSlice,
};

const store = configureStore({
  reducer,
});

export default store;
