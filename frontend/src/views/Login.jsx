import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Suspense, useRef, useState } from 'react';
import { Link } from '@mui/material';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { APIs } from '../API';
import { URL } from '../API/constant';

const Login = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  let navigate = useNavigate();
  const ref = useRef();

  const colorMode = 'light';
  const hadnleLogin = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      setLoginLoading(true);
      const resposne = await APIs('POST', URL.LOGIN, {
        email: formData.get('email'),
        password: formData.get('password'),
      });

      toast(resposne?.message);
      localStorage.setItem('token', resposne?.token);
      localStorage.setItem('user', JSON.stringify(resposne?.user));
      navigate('/');
      return setLoginLoading(false);
    } catch (error) {
      ref?.current?.reset();
      toast(error?.resposne.error.message);
      return setLoginLoading(false);
    }
  };
  return (
    <Suspense fallback={<div>...loading</div>}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => hadnleLogin(e)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: 'bold',
                backgroundColor: colorMode === 'light' ? '#9c27b0' : '#52e851',
                color: colorMode === 'light' ? 'white' : 'black',
                '&:hover': {
                  fontWeight: 'bolder',
                  backgroundColor:
                    colorMode === 'light' ? '#36003f' : '#6fff6e',
                  color: colorMode === 'light' ? 'white' : 'black',
                },
              }}
              disabled={loginLoading}
            >
              {loginLoading ? 'perform sign in...' : 'Sign In'}
            </Button>
            <Grid container>
              <Link component={RouterLink} to={'/register'}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Suspense>
  );
};

export default Login;
