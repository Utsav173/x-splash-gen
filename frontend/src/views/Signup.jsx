import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Suspense, useRef, useState } from 'react';
import { Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { APIs } from '../API';
import { URL } from '../API/constant';

const SignUp = () => {
  const [signupLoading, setSignupLoading] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      setSignupLoading(true);
      const resposne = await APIs('POST', URL.SIGNUP, {
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('name'),
      });

      toast(resposne.message);
      localStorage.setItem('token', resposne.token);
      localStorage.setItem('user', JSON.stringify(resposne.user));
      setSignupLoading(false);
      ref?.current?.reset();
      return navigate('/');
    } catch (error) {
      ref?.current?.reset();
      toast(error?.resposne.error.message);
      return setSignupLoading(false);
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSignup(e)}
            sx={{ mt: 3 }}
            autoComplete="off"
            ref={ref}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="full-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={signupLoading}
            >
              {signupLoading ? 'Submitting' : 'Sign up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Link component={RouterLink} to={'/login'}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Suspense>
  );
};

export default SignUp;
