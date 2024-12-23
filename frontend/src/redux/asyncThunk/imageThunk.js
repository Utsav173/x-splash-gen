import { createAsyncThunk } from '@reduxjs/toolkit';
import { URL } from '../../API/constant';
import { APIs } from '../../API';
import { toast } from 'react-toastify';

export const handleFetchPost = createAsyncThunk(
  'image/handleFetchPost',
  async (_, { rejectWithValue, getState }) => {
    try {
      const currentPage = getState().image.currentPage;
      const searchTerm = getState().image.searchTerm;
      let uri;
      if (searchTerm !== '') {
        uri = `${URL.GET_POSTS}?q=${searchTerm}`;
      } else if (currentPage !== null) {
        uri = `${URL.GET_POSTS}?page=${currentPage}`;
      } else {
        uri = URL.GET_POSTS;
      }

      const response = await APIs('GET', uri);
      return response;
    } catch (error) {
      toast(error.message);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleLikePost = createAsyncThunk(
  'image/handleLikePost',
  async (imageId, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('Please login first');
        return rejectWithValue('unauthorized');
      } else {
        const response = await APIs(
          'POST',
          URL.LIKE_IMAGE(imageId),
          {},
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        );

        toast(response.message);
        dispatch(handleFetchPost());
        return response;
      }
    } catch (error) {
      toast(error.message);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
