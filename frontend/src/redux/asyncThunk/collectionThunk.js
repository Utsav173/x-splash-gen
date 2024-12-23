import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIs } from '../../API';
import { toast } from 'react-toastify';
import { URL } from '../../API/constant';

export const fetchCollectionList = createAsyncThunk(
  'addCollection/fetchCollectionList',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await APIs(
        'GET',
        'http://localhost:8080/collections',
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const getSingleCollection = createAsyncThunk(
  'addCollection/getSingleCollection',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await APIs(
        'GET',
        URL.G_U_D_COLL(id),
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const createNewCollection = createAsyncThunk(
  'addCollection/createNewCollection',
  async (title, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await APIs(
        'POST',
        URL.GET_CRE_COLL,
        {
          title: title,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      dispatch(fetchCollectionList());
      toast(response.message);
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const addToCollection = createAsyncThunk(
  'addCollection/addToCollection',
  async ({ collectionId, imageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await APIs(
        'POST',
        URL.A_R_IMAGE_TO_COLLECTION(collectionId, imageId),
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast(response.message);
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
