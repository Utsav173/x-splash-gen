import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { setIsHomePage } from '../redux/slice/ImageSlice';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { APIs } from '../API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { handleCreatePost } from '../redux/asyncThunk/imageDetailThunk';
const CreatePost = () => {
  const dispatch = useDispatch();
  const [selectFile, setSelectFile] = useState(null);
  const [tagsData, setTagsData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { createLoading } = useSelector((state) => state.imageDetail);
  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/');
    } else {
      dispatch(setIsHomePage(false));
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.append('image', selectFile);
      formData.append('tags', JSON.stringify(selectedTags));
      dispatch(handleCreatePost({ formData, navigate }));
    } catch (error) {
      console.error(error);
      toast(error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await APIs('GET', 'http://localhost:8080/tags');
      if (!response.error) {
        setTagsData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ marginBottom: '2rem' }}>
            Create post
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSubmit(e)}
            sx={{ width: '100%' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Tags
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="Tags"
                    multiple
                    value={selectedTags}
                    onChange={handleTagChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.name} />
                        ))}
                      </Box>
                    )}
                  >
                    {tagsData.map((tag) => (
                      <MenuItem key={tag._id} value={tag}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <label htmlFor="file-input">
                    <input
                      id="file-input"
                      type="file"
                      accept=".jpg, .jpeg, .png, .gif"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </label>
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {selectFile ? (
                      <>
                        {selectFile.name} ({(selectFile.size / 1024).toFixed(2)}{' '}
                        KB)
                      </>
                    ) : (
                      'Upload File'
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: '2rem',
                mb: '1rem',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey',
                  color: 'white',
                },
              }}
              disabled={createLoading}
            >
              {createLoading ? 'Uploading...' : 'Create Post'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreatePost;
