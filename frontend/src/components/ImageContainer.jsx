import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { setCols } from '../redux/slice/ImageSlice';
import { handleLikePost } from '../redux/asyncThunk/imageThunk';

export default function CustomImageList({ itemData }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const cols = useSelector((state) => state.image.cols);
  const userId = useSelector((state) => state.image.userId);

  const getCols = () => {
    if (theme.breakpoints.values.xl <= window.innerWidth) {
      return 5;
    }
    if (theme.breakpoints.values.lg <= window.innerWidth) {
      return 4;
    }
    if (theme.breakpoints.values.md <= window.innerWidth) {
      return 3;
    }
    if (theme.breakpoints.values.sm <= window.innerWidth) {
      return 2;
    }
    return 1;
  };
  useEffect(() => {
    dispatch(setCols(getCols()));
  }, []);

  useEffect(() => {
    function handleResize() {
      dispatch(setCols(getCols()));
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ImageList
      variant="masonry"
      sx={{
        width: '100%',
        marginTop: '0',
        paddingTop: '10px',
      }}
      rowHeight={'auto'}
      cols={cols}
      gap={8}
    >
      {itemData &&
        itemData.map((item, i) => {
          const cols = item.uploadedBy?.username ? 2 : 1;
          const rows = item.likes.length > 0 ? 2 : 1;
          return (
            <ImageListItem
              key={i + item._id}
              cols={cols}
              rows={rows}
              sx={{
                borderRadius: '5px',
                boxShadow: 2,
              }}
              onMouseEnter={() => setIsHovered(item._id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
              />

              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  borderRadius: '5px',
                }}
                title={
                  <Stack direction={'row'}>
                    <Typography
                      component={RouterLink}
                      to={`/image/${item._id}`}
                      fontWeight={'bold'}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'white',
                        },
                        color: '#f3f3f3',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography>
                      {item.uploadedBy?.username && (
                        <span
                          style={{
                            marginLeft: '10px',
                            color: '#d8d8d8',
                            fontSize: '12px',
                          }}
                        >
                          by {item.uploadedBy?.username}
                        </span>
                      )}
                    </Typography>
                  </Stack>
                }
                position="top"
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    aria-label={`star ${item.title}`}
                    onClick={() => dispatch(handleLikePost(item._id))}
                  >
                    {item.likes.map((it) => it._id).includes(userId) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                }
                actionPosition="left"
              />
              {isHovered === item._id && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: '5px',
                    top: '5px',
                    zIndex: '2',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => saveAs(item.imageUrl, item._id)}
                >
                  <DownloadIcon />
                </IconButton>
              )}
            </ImageListItem>
          );
        })}
    </ImageList>
  );
}

CustomImageList.propTypes = {
  itemData: PropTypes.array.isRequired,
};
