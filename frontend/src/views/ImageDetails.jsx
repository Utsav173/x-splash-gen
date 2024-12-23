import { useNavigate, useParams } from 'react-router-dom';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Paper,
  CardMedia,
  Box,
  Grid,
  TextField,
  Stack,
  Button,
  Chip,
} from '@mui/material';

import { setIsHomePage } from '../redux/slice/ImageSlice';
import { Delete, DownloadDone } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenReplyInput } from '../redux/slice/ImageDetail';
import {
  fetchComments,
  handleCreateComment,
  handleDeletePost,
  handleFetchSinglePost,
  handleReplyComment,
} from '../redux/asyncThunk/imageDetailThunk';
const Navbar = lazy(() => import('../components/Navbar'));
const AddCollection = lazy(() => import('../components/AddCollection'));

const ImageDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commentRef = useRef();
  const imageDetail = useSelector((state) => state.imageDetail.imageDetail);
  const comments = useSelector((state) => state.imageDetail.comments);
  const openReplyInput = useSelector(
    (state) => state.imageDetail.openReplyInput
  );

  const [replayComment, setReplayComment] = useState('');

  const handleCommentClick = (commentId) => {
    dispatch(
      setOpenReplyInput(openReplyInput === commentId ? null : commentId)
    );
  };

  useEffect(() => {
    dispatch(setIsHomePage(false));
    dispatch(handleFetchSinglePost(id));
    dispatch(fetchComments(id));
  }, [dispatch]);

  const handleCommentSubmit = async (e) => {
    try {
      e.preventDefault();
      const comment = e.target.comment.value;
      if (!comment) {
        return toast('Please enter a comment');
      }
      dispatch(
        handleCreateComment({
          data: {
            content: comment,
            image: id,
          },
          postID: id,
        })
      );
      commentRef?.current?.reset();
    } catch (error) {
      console.error(error);
      toast('An error occurred while posting the comment');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    try {
      e.preventDefault();
      if (replayComment.length === 0) {
        return toast('Please enter a comment');
      }

      dispatch(
        handleReplyComment({
          data: {
            content: replayComment,
            image: id,
            comment: parentId,
          },
          postID: id,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      {imageDetail && (
        <Container maxWidth="lg" sx={{ marginTop: 4, paddingBottom: 4 }}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  alt={imageDetail.title}
                  loading="lazy"
                  height="auto"
                  image={imageDetail.imageUrl}
                  sx={{ width: '100%', borderRadius: '5px' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {imageDetail.title}
                  </Typography>
                  <Typography variant="subtitle1">Description:</Typography>
                  <Typography paragraph>{imageDetail.description}</Typography>
                  <Typography variant="subtitle1">Uploaded By:</Typography>
                  <Typography paragraph>
                    {imageDetail.uploadedBy.username}
                  </Typography>
                  <Typography variant="subtitle1">Tags:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {imageDetail.tags.map((tag) => (
                      <Chip
                        key={tag._id}
                        label={tag.name}
                        size="small"
                        sx={{
                          margin: '4px 4px',
                          paddingInline: '5px',
                          boxShadow: '0px 4px 3px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#f0faff',
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="subtitle1">Created At:</Typography>
                  <Typography paragraph>
                    {new Date(imageDetail.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1">Updated At:</Typography>
                  <Typography paragraph>
                    {new Date(imageDetail.updatedAt).toLocaleString()}
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={3}
                    alignItems={{
                      xs: 'stretch',
                      sm: 'center',
                    }}
                  >
                    <Button
                      sx={{ mt: 4 }}
                      onClick={() =>
                        saveAs(imageDetail.imageUrl, imageDetail._id)
                      }
                      startIcon={<DownloadDone />}
                      variant="contained"
                      color="primary"
                    >
                      Download
                    </Button>
                    {localStorage.getItem('token') && (
                      <>
                        <AddCollection imageId={imageDetail._id} />
                        {imageDetail.uploadedBy._id ===
                          JSON.parse(localStorage.getItem('user'))?._id && (
                          <Button
                            sx={{ mt: 4 }}
                            onClick={() =>
                              dispatch(
                                handleDeletePost({
                                  id: imageDetail._id,
                                  navigate,
                                })
                              )
                            }
                            startIcon={<Delete />}
                            variant="contained"
                            color="error"
                          >
                            Delete Post
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            {localStorage.getItem('token') && (
              <Box
                component={'form'}
                onSubmit={handleCommentSubmit}
                sx={{ mt: 4 }}
                ref={commentRef}
              >
                <TextField
                  fullWidth
                  id="comment"
                  label="Add a comment"
                  variant="outlined"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Comment
                </Button>
              </Box>
            )}
            {comments.length > 0 && (
              <>
                <Typography variant="h6" mt={4}>
                  Comments:
                </Typography>
                {comments.map((comment) => (
                  <Box key={comment._id} sx={{ ml: 4, mt: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        onClick={() => handleCommentClick(comment._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <strong>{comment.user.username}:</strong>
                        {comment.content}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {comment.replyTo && (
                      <Box sx={{ ml: 4 }}>
                        <Typography>
                          Reply to <strong>{comment.replyTo.content}</strong>:{' '}
                          {comment.content}
                        </Typography>
                      </Box>
                    )}
                    {localStorage.getItem('token') &&
                      openReplyInput === comment._id && (
                        <Box
                          component={'form'}
                          onSubmit={(e) => handleReplySubmit(e, comment._id)}
                          sx={{ mt: 2 }}
                        >
                          <TextField
                            fullWidth
                            required
                            id={`reply-${comment._id}`}
                            label="Add a reply"
                            variant="outlined"
                            onChange={(e) => setReplayComment(e.target.value)}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                          >
                            Submit Reply
                          </Button>
                        </Box>
                      )}
                  </Box>
                ))}
              </>
            )}
          </Paper>
        </Container>
      )}
    </Suspense>
  );
};

export default ImageDetails;
