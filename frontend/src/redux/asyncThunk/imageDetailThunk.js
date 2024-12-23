import { createAsyncThunk } from '@reduxjs/toolkit';
import { URL } from '../../API/constant';
import { toast } from 'react-toastify';
import { APIs } from '../../API';
import { setCreateLoading, setOpenReplyInput } from '../slice/ImageDetail';
import { handleFetchPost } from './imageThunk';

export const handleCreatePost = createAsyncThunk(
  'imageDetail/handleCreatePost',
  async ({ formData, navigate }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setCreateLoading(true));
      const response = await APIs('POST', URL.CREATE_POST, formData, {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });

      if (response.message) {
        toast(response.message);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    } finally {
      dispatch(setCreateLoading(false));
    }
  }
);

export const handleFetchSinglePost = createAsyncThunk(
  'imageDetail/handleFetchSinglePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await APIs('GET', URL.G_POST_D_POST(id));
      return response;
    } catch (error) {
      console.error(error);
      toast(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const fetchComments = createAsyncThunk(
  'imageDetail/fetchComments',
  async (id, { rejectWithValue }) => {
    try {
      const response = await APIs('GET', URL.GET_COMMENTS(id));
      return response;
    } catch (error) {
      toast(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleCreateComment = createAsyncThunk(
  'imageDetail/handleCreateComment',
  async ({ data, postID }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('Please login first');
        return rejectWithValue('unauthorized');
      } else {
        const response = await APIs('POST', URL.CREATE_COMMENT, data, {
          Authorization: `Bearer ${token}`,
        });

        toast(response.message);

        dispatch(fetchComments(postID));
        return response;
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleReplyComment = createAsyncThunk(
  'imageDetail/handleReplyComment',
  async ({ data, postID }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast('Please login first');
        return rejectWithValue('unauthorized');
      } else {
        const response = await APIs('POST', URL.REPLAY_COMMENT, data, {
          Authorization: `Bearer ${token}`,
        });

        toast('Comment posted successfully');
        dispatch(fetchComments(postID));
        dispatch(setOpenReplyInput(null));
        return response;
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleDeletePost = createAsyncThunk(
  'imageDetail/handleDeletePost',
  async ({ id, navigate }, { rejectWithValue, dispatch }) => {
    try {
      const response = await APIs(
        'DELETE',
        URL.G_POST_D_POST(id),
        {},
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      );
      dispatch(handleFetchPost);
      navigate('/');
      toast(response.message);
      return response;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
