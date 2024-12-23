import axios from 'axios';
import { toast } from 'react-toastify';
export const APIs = async (method, url, data, headers, options = {}) => {
  try {
    let response;

    const config = {
      headers: headers || {},
      ...options,
    };

    switch (method) {
      case 'GET':
        response = await axios.get(url, config);
        break;
      case 'POST':
        response = await axios.post(url, data, config);
        break;
      case 'PUT':
        response = await axios.put(url, data, config);
        break;
      case 'DELETE':
        response = await axios.delete(url, config);
        break;
      default:
        break;
    }

    if (response && response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error('Request failed with status: ' + response.status);
    }
  } catch (error) {
    return handleAPIError(error);
  }
};

const handleAPIError = (error) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401 || status === 403) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response.data && error.response.data.length === 0) {
      return toast('No data found');
    }

    toast.error(error.response.data.error || error.response.data.message);
    return error.response.data.error || error.response.data.message;
  } else if (error.request) {
    toast.error('No response received from server');
    return { error: 'No response received from server', status: null };
  } else {
    toast.error(error.message);
    return { error: error.message, status: null };
  }
};
