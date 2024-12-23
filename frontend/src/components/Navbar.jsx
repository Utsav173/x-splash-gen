import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../redux/slice/ImageSlice';
import { Button, useMediaQuery } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isHomePage = useSelector((state) => state.image.isHomePage);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSearch = (e) => {
    setTimeout(() => {
      dispatch(setSearchTerm(e.target.value));
    }, 1200);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            paddingBlock: 1,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={'/'}
            sx={{ display: { xs: 'none', sm: 'block' }, textDecoration: 'none', color: '#fff' }}
          >
            X-Splash
          </Typography>
          {isHomePage && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={handleSearch}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <IconButton
              size="large"
              aria-label="show more"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex' }}>
              {localStorage.getItem('token') ? (
                <>
                  <Button component={Link} to="/profile" color="inherit">
                    Profile
                  </Button>
                  <Button component={Link} to="/create" color="inherit">
                    Create
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    Login
                  </Button>
                  <Button component={Link} to="/register" color="inherit">
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
          <Menu
            id="primary-search-account-menu-mobile"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'transparent',
                '& .MuiList-root': {
                  backdropFilter: 'blur(70px)',
                  color: 'white',
                },
              },
            }}
          >
            {localStorage.getItem('token')
              ? [
                  <MenuItem
                    key={1}
                    onClick={handleMenuClose}
                    component={Link}
                    to="/create"
                  >
                    Create
                  </MenuItem>,
                  <MenuItem key={2} onClick={handleLogout}>
                    Logout
                  </MenuItem>,
                ]
              : [
                  <MenuItem
                    key={3}
                    onClick={handleMenuClose}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </MenuItem>,
                  <MenuItem
                    key={4}
                    onClick={handleMenuClose}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </MenuItem>,
                ]}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
