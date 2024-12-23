import { Suspense, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { fetchCollectionList } from '../redux/asyncThunk/collectionThunk';
import { useDispatch, useSelector } from 'react-redux';
import CollectionTable from '../components/CollectionTable';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const collectionList = useSelector(
    (state) => state.addCollection.collectionList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollectionList());
    setUserData(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 3,
        }}
      >
        <Card
          sx={{
            marginBottom: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5">{userData?.username}</Typography>
            <Typography variant="body2">{userData?.email}</Typography>
          </CardContent>
        </Card>

        <Box>
          {collectionList.length > 0 ? (
            <CollectionTable rows={collectionList} />
          ) : (
            <Typography variant="h5">No Collections</Typography>
          )}
        </Box>
      </Box>
    </Suspense>
  );
};

export default Profile;
