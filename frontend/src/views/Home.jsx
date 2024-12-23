import { Suspense, lazy, useEffect } from 'react';
import { Box, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUserId,
  setCurrentPage,
  setIsHomePage,
} from '../redux/slice/ImageSlice';
import { handleFetchPost } from '../redux/asyncThunk/imageThunk';

const CustomImageList = lazy(() => import('../components/ImageContainer'));

const MainDiv = styled(Box)(({ theme }) => ({
  paddingInline: theme.breakpoints.up('md')
    ? theme.spacing(3)
    : theme.spacing(4),
  minHeight: '100vh',
  paddingBottom: theme.breakpoints.up('md')
    ? theme.spacing(3)
    : theme.spacing(4),
  justifyContent: 'space-evenly',
}));

const Homepage = () => {
  const dispatch = useDispatch();
  const imageData = useSelector((state) => state.image.imageData);
  const searchTerm = useSelector((state) => state.image.searchTerm);
  const currentPage = useSelector((state) => parseInt(state.image.currentPage));
  const totalPages = useSelector((state) => state.image.totalPages);

  const fetchImages = () => {
    try {
      if (localStorage.getItem('user')) {
        dispatch(setUserId(JSON.parse(localStorage.getItem('user'))._id));
      }
      dispatch(handleFetchPost());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(setIsHomePage(true));
    fetchImages();
  }, [searchTerm, currentPage, dispatch]);

  return (
    <MainDiv className="main-div">
      {imageData.length > 0 ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Box display={'flex'} flexDirection={'column'}>
            <CustomImageList itemData={imageData} />
          </Box>
        </Suspense>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: 'white',
            paddingBlock: 5,
          }}
        >
          No images found
        </Box>
      )}
      {totalPages > 1 && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={(event, value) => dispatch(setCurrentPage(value))}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
              },
            }}
          />
        </Box>
      )}
    </MainDiv>
  );
};

export default Homepage;
