import { useState } from 'react';
import {
  Button,
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  addToCollection,
  createNewCollection,
  fetchCollectionList,
} from '../redux/asyncThunk/collectionThunk';
const AddToCollection = ({ imageId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [title, setTitleValue] = useState('');
  const collectionList = useSelector(
    (state) => state.addCollection.collectionList
  );

  const handleClickOpen = () => {
    setOpen(true);
    dispatch(fetchCollectionList());
  };

  const handleClose = () => {
    setOpen(false);
    setOpenNew(false);
  };

  const handleSubmit = async () => {
    try {
      if (openNew) {
        dispatch(createNewCollection(title));
        setTitleValue('');
      }
      handleClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleListItemClick = async (value) => {
    try {
      dispatch(addToCollection({ collectionId: value, imageId }));
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
      dispatch(fetchCollectionList());
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add to collection
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {collectionList.length > 0
            ? 'Select Collection'
            : 'Create Collection'}
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          {collectionList.map((item) => (
            <ListItem disableGutters key={item._id}>
              <ListItemButton onClick={() => handleListItemClick(item._id)}>
                {item.title}
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disableGutters>
            <ListItemButton onClick={() => setOpenNew(true)}>
              <ListItemAvatar>
                <Avatar>
                  <AddCircleOutline />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add Collection" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
      <Dialog open={openNew} onClose={handleClose}>
        <DialogTitle>Add title of your collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Collection Title"
            type="text"
            onChange={(e) => setTitleValue(e.target.value)}
            fullWidth
            value={title}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

AddToCollection.propTypes = {
  imageId: PropTypes.string,
};

export default AddToCollection;
